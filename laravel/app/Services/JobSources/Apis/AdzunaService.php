<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class AdzunaService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $country = $this->config['country'] ?? 'gb';
        $appId   = $this->config['app_id']  ?? null;
        $appKey  = $this->config['app_key'] ?? null;

        if (! $appId || ! $appKey) {
            Log::warning("[JobSource:{$this->sourceName}] Missing app_id or app_key — skipping");
            return [];
        }

        $query = [
            'app_id'        => $appId,
            'app_key'       => $appKey,
            'results_per_page' => 50,
            'content-type'  => 'application/json',
        ];

        if (! empty($params['job'])) {
            $query['what'] = $params['job'];
        }

        if (! empty($params['location'])) {
            $query['where'] = $params['location'];
        }

        $url = "{$this->config['base_url']}/{$country}/search/1";

        Log::info("[JobSource:{$this->sourceName}] Requesting Adzuna API", ['url' => $url]);

        $response = $this->http()->get($url, $query);
        $response->throw();

        $data = $response->json();

        return $data['results'] ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => (string) ($raw['id'] ?? ''),
            'source'       => $this->sourceName,
            'title'        => $raw['title'] ?? '',
            'company'      => $raw['company']['display_name'] ?? null,
            'location'     => $raw['location']['display_name'] ?? null,
            'url'          => $raw['redirect_url'] ?? '',
            'description'  => $raw['description'] ?? null,
            'salary'       => isset($raw['salary_min']) ? "{$raw['salary_min']} - {$raw['salary_max']}" : null,
            'tags'         => isset($raw['category']['tag']) ? [$raw['category']['tag']] : null,
            'posted_at'    => $raw['created'] ?? null,
        ];
    }
}
