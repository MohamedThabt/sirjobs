<?php

namespace App\Services\JobSources\Aggregators;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class SerpApiGoogleJobsService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $apiKey = $this->config['api_key'] ?? null;

        if (! $apiKey) {
            Log::warning("[JobSource:{$this->sourceName}] Missing api_key — skipping");
            return [];
        }

        $query = [
            'engine'  => 'google_jobs',
            'api_key' => $apiKey,
        ];

        if (! empty($params['job'])) {
            $query['q'] = $params['job'];
        } else {
            $query['q'] = 'software engineer';  // default query required by API
        }

        if (! empty($params['location'])) {
            $query['location'] = $params['location'];
        }

        $url = $this->config['base_url'];

        Log::info("[JobSource:{$this->sourceName}] Requesting SerpAPI Google Jobs", ['url' => $url]);

        $response = $this->http()->get($url, $query);
        $response->throw();

        $data = $response->json();

        return $data['jobs_results'] ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => md5(($raw['job_id'] ?? '') . ($raw['title'] ?? '')),
            'source'       => $this->sourceName,
            'title'        => $raw['title'] ?? '',
            'company'      => $raw['company_name'] ?? null,
            'location'     => $raw['location'] ?? null,
            'url'          => $raw['share_link'] ?? $raw['related_links'][0]['link'] ?? '',
            'description'  => $raw['description'] ?? null,
            'salary'       => null,
            'tags'         => $raw['extensions'] ?? null,
            'posted_at'    => null,
        ];
    }
}
