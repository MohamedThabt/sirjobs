<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class ReedApiService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $apiKey = $this->config['api_key'] ?? null;

        if (! $apiKey) {
            Log::warning("[JobSource:{$this->sourceName}] Missing api_key — skipping");
            return [];
        }

        $query = [
            'resultsToTake' => 50,
        ];

        if (! empty($params['job'])) {
            $query['keywords'] = $params['job'];
        }

        if (! empty($params['location'])) {
            $query['locationName'] = $params['location'];
        }

        $url = $this->config['base_url'];

        Log::info("[JobSource:{$this->sourceName}] Requesting Reed API", ['url' => $url]);

        // Reed uses HTTP Basic Auth: api_key as username, empty password
        $response = $this->http()
            ->withBasicAuth($apiKey, '')
            ->get($url, $query);

        $response->throw();

        $data = $response->json();

        return $data['results'] ?? $data ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => (string) ($raw['jobId'] ?? ''),
            'source'       => $this->sourceName,
            'title'        => $raw['jobTitle'] ?? '',
            'company'      => $raw['employerName'] ?? null,
            'location'     => $raw['locationName'] ?? null,
            'url'          => $raw['jobUrl'] ?? '',
            'description'  => $raw['jobDescription'] ?? null,
            'salary'       => isset($raw['minimumSalary'])
                ? "{$raw['minimumSalary']} - " . ($raw['maximumSalary'] ?? '?')
                : null,
            'tags'         => null,
            'posted_at'    => $raw['date'] ?? null,
        ];
    }
}
