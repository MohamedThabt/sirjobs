<?php

namespace App\Services;

use App\Models\JobListing;
use App\Services\JobSources\Apis\AdzunaService;
use App\Services\JobSources\Apis\ArbeitnowService;
use App\Services\JobSources\Apis\FastApiCollectorService;
use App\Services\JobSources\Apis\ReedApiService;
use App\Services\JobSources\Apis\RemotiveService;
use App\Services\JobSources\Apis\TheMuseService;
use App\Services\JobSources\Aggregators\JobicyService;
use App\Services\JobSources\Aggregators\SerpApiGoogleJobsService;
use App\Services\JobSources\Apis\HackerNewsService;
use App\Services\JobSources\BaseJobSourceService;
use App\Services\JobSources\Rss\ReedRssService;
use App\Services\JobSources\Rss\RemoteOkRssService;
use App\Services\JobSources\Rss\WorkingNomadsRssService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class JobSourceManager
{
    /**
     * Map driver names ➜ service classes.
     */
    protected static array $driverMap = [
        'adzuna'    => AdzunaService::class,
        'remotive'  => RemotiveService::class,
        'reed_api'  => ReedApiService::class,
        'the_muse'  => TheMuseService::class,
        'arbeitnow' => ArbeitnowService::class,
        'serpapi'   => SerpApiGoogleJobsService::class,
        'jobicy'    => JobicyService::class,
        'hacker_news' =>HackerNewsService::class,
        'fastapi_collector' => FastApiCollectorService::class,
    ];

    /**
     * Map source_name (for RSS sources that share the 'rss' driver) ➜ service classes.
     */
    protected static array $rssMap = [
        'reed_rss'           => ReedRssService::class,
        'remoteok_rss'       => RemoteOkRssService::class,
        'working_nomads_rss' => WorkingNomadsRssService::class,
    ];

    /**
     * Resolve a single source config into a service instance.
     */
    public function resolve(string $name, array $config): ?BaseJobSourceService
    {
        $driver = $config['driver'] ?? null;

        if ($driver === 'rss') {
            $sourceName = $config['source_name'] ?? $name;
            $class = static::$rssMap[$sourceName] ?? null;
        } else {
            $class = static::$driverMap[$driver] ?? null;
        }

        if (! $class) {
            Log::warning("[JobSourceManager] Unknown driver '{$driver}' for source '{$name}' — skipping");
            return null;
        }

        return new $class($config, $name);
    }

    /**
     * Collect from all active sources, persist to DB.
     *
     * @param  array  $params  ['job' => string|null, 'location' => string|null]
     * @return array  ['total' => int, 'sources' => ['source_name' => count, ...], 'errors' => [...]]
     */
    public function collectAll(array $params = []): array
    {
        $sources   = config('job_sources', []);
        $results   = [];
        $errors    = [];
        $total     = 0;

        Log::info('[JobSourceManager] Starting full collection run', [
            'active_sources' => collect($sources)->where('active', true)->keys()->all(),
            'params'         => $params,
        ]);

        foreach ($sources as $name => $config) {
            if (! ($config['active'] ?? false)) {
                Log::info("[JobSourceManager] Source '{$name}' is inactive — skipping");
                continue;
            }

            try {
                $service = $this->resolve($name, $config);

                if (! $service) {
                    continue;
                }

                $count = $service->collectAndStore($params);
                $results[$name] = $count;
                $total += $count;

                Log::info("[JobSourceManager] Source '{$name}' collected {$count} jobs");

            } catch (\Throwable $e) {
                $errors[] = [
                    'source'  => $name,
                    'error'   => $e->getMessage(),
                ];

                Log::error("[JobSourceManager] Source '{$name}' failed", [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        Log::info("[JobSourceManager] Collection run complete", [
            'total_jobs'   => $total,
            'source_counts' => $results,
            'errors_count'  => count($errors),
        ]);

        return [
            'total'   => $total,
            'sources' => $results,
            'errors'  => $errors,
        ];
    }

    /**
     * Collect normalized jobs from all active sources without writing to DB.
     *
     * @return array ['total' => int, 'sources' => array, 'errors' => array, 'jobs' => array]
     */
    public function collectAllNormalized(array $params = []): array
    {
        $sources = config('job_sources', []);
        $results = [];
        $errors = [];
        $jobs = [];
        $total = 0;

        Log::info('[JobSourceManager] Starting normalized collection run', [
            'active_sources' => collect($sources)->where('active', true)->keys()->all(),
            'params'         => $params,
        ]);

        foreach ($sources as $name => $config) {
            if (! ($config['active'] ?? false)) {
                continue;
            }

            try {
                $service = $this->resolve($name, $config);

                if (! $service) {
                    continue;
                }

                $sourceJobs = $service->collectNormalized($params);
                $results[$name] = count($sourceJobs);
                $total += count($sourceJobs);
                $jobs = array_merge($jobs, $sourceJobs);
            } catch (\Throwable $e) {
                $errors[] = [
                    'source' => $name,
                    'error'  => $e->getMessage(),
                ];

                Log::error("[JobSourceManager] Source '{$name}' failed during normalized collection", [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        return [
            'total'   => $total,
            'sources' => $results,
            'errors'  => $errors,
            'jobs'    => $jobs,
        ];
    }

    /**
     * Delete jobs older than the given number of days.
     */
    public function pruneOlderThan(int $days): int
    {
        $cutoff = now()->subDays($days);

        $deleted = JobListing::where('posted_at', '<', $cutoff)
            ->orWhereNull('posted_at')
            ->delete();

        Log::info("[JobSourceManager] Pruned {$deleted} jobs older than {$days} days");

        return $deleted;
    }

    /**
     * Refresh mode: collect first, then replace the DB in one transaction.
     * Old jobs are kept if collection fails or returns nothing.
     */
    public function replaceDatabaseWithFreshCollection(array $params = []): array
    {
        $collection = $this->collectAllNormalized($params);
        $collection['replaced'] = false;

        if (($collection['total'] ?? 0) <= 0 || empty($collection['jobs'])) {
            $collection['errors'][] = [
                'source' => 'pipeline',
                'error'  => 'No jobs were collected, database was left unchanged.',
            ];

            return $collection;
        }

        $seen = [];
        $rows = [];
        $now = now();

        foreach ($collection['jobs'] as $job) {
            $title = $job['title'] ?? null;
            $url = $job['url'] ?? null;
            $source = $job['source'] ?? null;

            if (! $title || ! $url || ! $source) {
                continue;
            }

            $externalId = $job['external_id'] ?? md5($url);
            $uniqueKey = $source.'|'.$externalId;

            if (isset($seen[$uniqueKey])) {
                continue;
            }
            $seen[$uniqueKey] = true;

            $tags = null;
            if (array_key_exists('tags', $job) && is_array($job['tags'])) {
                $tags = json_encode(array_values($job['tags']));
            }

            $rows[] = [
                'external_id' => $externalId,
                'source'      => $source,
                'title'       => $title,
                'company'     => $job['company'] ?? null,
                'location'    => $job['location'] ?? null,
                'region'      => $job['region'] ?? null,
                'url'         => $url,
                'description' => $job['description'] ?? null,
                'salary'      => $job['salary'] ?? null,
                'tags'        => $tags,
                'posted_at'   => $job['posted_at'] ?? null,
                'created_at'  => $now,
                'updated_at'  => $now,
            ];
        }

        if (empty($rows)) {
            $collection['errors'][] = [
                'source' => 'pipeline',
                'error'  => 'Collected data was empty after normalization, database was left unchanged.',
            ];

            return $collection;
        }

        try {
            DB::transaction(function () use ($rows) {
                JobListing::query()->delete();

                foreach (array_chunk($rows, 500) as $chunk) {
                    DB::table('job_listings')->insert($chunk);
                }
            });

            $collection['replaced'] = true;
            $collection['total'] = count($rows);
        } catch (\Throwable $e) {
            $collection['errors'][] = [
                'source' => 'database',
                'error'  => $e->getMessage(),
            ];

            Log::error('[JobSourceManager] Failed to replace database after collection', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return $collection;
    }
}
