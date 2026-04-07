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

    abstract public function fetchJobs(array $params = []): array;

    abstract protected function normalizeJob(array $raw): array;

    /**
     * Build a single search string from the new keywords/categories params,
     * falling back to the legacy 'job' param for backward compatibility.
     */
    protected function buildSearchTerm(array $params): ?string
    {
        $parts = [];

        $keywords = $params['keywords'] ?? [];
        if (is_array($keywords)) {
            $parts = array_merge($parts, array_filter($keywords));
        }

        if (! empty($params['categories']) && is_array($params['categories'])) {
            $parts = array_merge($parts, array_filter($params['categories']));
        } elseif (! empty($params['category'])) {
            $parts[] = $params['category'];
        }

        if (! empty($parts)) {
            return implode(' ', $parts);
        }

        return $params['job'] ?? null;
    }

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
     * Ensure required fields and defaults are set before storing/returning.
     */
    protected function sanitizeNormalized(array $normalized): ?array
    {
        if (empty($normalized['title']) || empty($normalized['url'])) {
            Log::warning("[JobSource:{$this->sourceName}] Skipping job with missing title or URL", $normalized);
            return null;
        }

        $normalized['source'] = $normalized['source'] ?? $this->sourceName;
        $normalized['external_id'] = $normalized['external_id'] ?? md5($normalized['url']);

        return $normalized;
    }

    /**
     * Upsert a normalized job into the database.
     * Uses source + external_id to prevent duplicates.
     */
    protected function persist(array $normalized): ?JobListing
    {
        $normalized = $this->sanitizeNormalized($normalized);

        if (! $normalized) {
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
     * Full pipeline: fetch and normalize without touching the DB.
     * Returns normalized jobs ready for persistence.
     */
    public function collectNormalized(array $params = []): array
    {
        Log::info("[JobSource:{$this->sourceName}] Starting normalized collection", [
            'params' => $params,
        ]);

        $rawJobs = $this->fetchJobs($params);

        Log::info("[JobSource:{$this->sourceName}] Fetched {count} raw jobs", [
            'count' => count($rawJobs),
        ]);

        $normalizedJobs = [];

        foreach ($rawJobs as $raw) {
            try {
                $normalized = $this->normalizeJob($raw);
                $normalized = $this->sanitizeNormalized($normalized);

                if ($normalized) {
                    $normalizedJobs[] = $normalized;
                }
            } catch (\Throwable $e) {
                Log::warning("[JobSource:{$this->sourceName}] Failed to normalize a single job", [
                    'error' => $e->getMessage(),
                    'raw'   => array_slice($raw, 0, 5),
                ]);
            }
        }

        Log::info("[JobSource:{$this->sourceName}] Normalized collection complete — {count} jobs", [
            'count' => count($normalizedJobs),
        ]);

        return $normalizedJobs;
    }

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
            $normalizedJobs = $this->collectNormalized($params);

            $persisted = 0;

            foreach ($normalizedJobs as $normalized) {
                $listing = $this->persist($normalized);

                if ($listing) {
                    $persisted++;
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
