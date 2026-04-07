<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class ArbeitnowService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $url = $this->config['base_url'];

        $query = [];

        if (! empty($params['location'])) {
            $query['location'] = $params['location'];
        }

        Log::info("[JobSource:{$this->sourceName}] Requesting Arbeitnow API", ['url' => $url]);

        $response = $this->http()->get($url, $query);
        $response->throw();

        $data = $response->json();
        $jobs = $data['data'] ?? [];

        $searchTerm = $this->buildSearchTerm($params);
        if ($searchTerm) {
            $keyword = strtolower($searchTerm);
            $jobs = array_filter($jobs, function ($job) use ($keyword) {
                return str_contains(strtolower($job['title'] ?? ''), $keyword)
                    || str_contains(strtolower($job['description'] ?? ''), $keyword);
            });
        }

        return array_values($jobs);
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => (string) ($raw['slug'] ?? md5($raw['url'] ?? '')),
            'source'       => $this->sourceName,
            'title'        => $raw['title'] ?? '',
            'company'      => $raw['company_name'] ?? null,
            'location'     => $raw['location'] ?? ($raw['remote'] ? 'Remote' : null),
            'url'          => $raw['url'] ?? '',
            'description'  => strip_tags($raw['description'] ?? ''),
            'salary'       => null,
            'tags'         => $raw['tags'] ?? null,
            'posted_at'    => $raw['created_at'] ?? null,
        ];
    }
}
