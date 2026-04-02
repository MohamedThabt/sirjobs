<?php

namespace App\Services\JobSources;

use App\Models\JobListing;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseJobSourceService
{
    protected array  $config;
    protected string $sourceName;

    public function __construct(array $config, string $sourceName)
    {
        $this->config     = $config;
        $this->sourceName = $sourceName;
    }

    /* ------------------------------------------------------------------ */
    /*  Abstract — each source must implement these                        */
    /* ------------------------------------------------------------------ */

    /**
     * Fetch raw jobs from the external source.
     *
     * @param  array  $params  ['job' => string|null, 'location' => string|null]
     * @return array  Array of normalized job arrays.
     */
    abstract public function fetchJobs(array $params = []): array;

    /**
     * Map a single raw API/RSS item to the canonical schema.
     */
    abstract protected function normalizeJob(array $raw): array;

    /* ------------------------------------------------------------------ */
    /*  HTTP helpers                                                        */
    /* ------------------------------------------------------------------ */

    /**
     * Pre-configured HTTP client with timeout and retries.
     */
    protected function http()
    {
        return Http::timeout(15)
                    ->retry(3, 500)
                    ->withHeaders([
                        'Accept' => 'application/json',
                    ]);
    }

    /* ------------------------------------------------------------------ */
    /*  Persistence                                                        */
    /* ------------------------------------------------------------------ */

    /**
     * Upsert a normalized job into the database.
     * Uses source + external_id to prevent duplicates.
     */
    protected function persist(array $normalized): ?JobListing
    {
        if (empty($normalized['title']) || empty($normalized['url'])) {
            Log::warning("[JobSource:{$this->sourceName}] Skipping job with missing title or URL", $normalized);
            return null;
        }

        return JobListing::updateOrCreate(
            [
                'source'      => $normalized['source'] ?? $this->sourceName,
                'external_id' => $normalized['external_id'] ?? md5($normalized['url']),
            ],
            [
                'title'       => $normalized['title'],
                'company'     => $normalized['company'] ?? null,
                'location'    => $normalized['location'] ?? null,
                'url'         => $normalized['url'],
                'description' => $normalized['description'] ?? null,
                'salary'      => $normalized['salary'] ?? null,
                'tags'        => $normalized['tags'] ?? null,
                'posted_at'   => $normalized['posted_at'] ?? null,
            ]
        );
    }

    /* ------------------------------------------------------------------ */
    /*  Orchestration — fetch ➜ normalize ➜ persist                        */
    /* ------------------------------------------------------------------ */

    /**
     * Full pipeline: fetch from source, normalize, store in DB.
     * Returns the count of jobs persisted.
     */
    public function collectAndStore(array $params = []): int
    {
        Log::info("[JobSource:{$this->sourceName}] Starting job collection", [
            'params' => $params,
        ]);

        try {
            $rawJobs = $this->fetchJobs($params);

            Log::info("[JobSource:{$this->sourceName}] Fetched {count} raw jobs", [
                'count' => count($rawJobs),
            ]);

            $persisted = 0;

            foreach ($rawJobs as $raw) {
                try {
                    $normalized = $this->normalizeJob($raw);
                    $listing    = $this->persist($normalized);

                    if ($listing) {
                        $persisted++;
                    }
                } catch (\Throwable $e) {
                    Log::warning("[JobSource:{$this->sourceName}] Failed to normalize/persist a single job", [
                        'error' => $e->getMessage(),
                        'raw'   => array_slice($raw, 0, 5), // log only first 5 fields
                    ]);
                }
            }

            Log::info("[JobSource:{$this->sourceName}] Collection complete — {$persisted} jobs persisted");

            return $persisted;

        } catch (\Throwable $e) {
            Log::error("[JobSource:{$this->sourceName}] Collection failed", [
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'params'  => $params,
            ]);

            return 0;
        }
    }
}
