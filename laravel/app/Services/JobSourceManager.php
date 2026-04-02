<?php

namespace App\Services;

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
}
