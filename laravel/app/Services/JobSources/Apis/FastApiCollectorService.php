<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class FastApiCollectorService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $baseUrl = rtrim($this->config['base_url'], '/');

        $query = [
            'search_term' => $params['job'] ?? 'software engineer',
        ];

        if (! empty($params['location'])) {
            $query['location'] = $params['location'];
        }

        if (isset($params['results_wanted'])) {
            $query['results_wanted'] = $params['results_wanted'];
        }

        Log::info("[JobSource:{$this->sourceName}] Requesting FastAPI collector", [
            'url'   => "{$baseUrl}/jobs/collect",
            'query' => $query,
        ]);

        $response = $this->http()
            ->timeout($this->config['timeout'] ?? 120)
            ->get("{$baseUrl}/jobs/collect", $query);

        $response->throw();

        $data = $response->json();

        return $data['jobs'] ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => $raw['external_id'] ?? md5($raw['url'] ?? ''),
            'source'      => $raw['source'] ?? $this->sourceName,
            'title'       => $raw['title'] ?? '',
            'company'     => $raw['company'] ?? null,
            'location'    => $raw['location'] ?? null,
            'url'         => $raw['url'] ?? '',
            'description' => $raw['description'] ?? null,
            'salary'      => $raw['salary'] ?? null,
            'tags'        => $raw['tags'] ?? null,
            'posted_at'   => $raw['posted_at'] ?? null,
        ];
    }
}
