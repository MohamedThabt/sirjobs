<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class RemotiveService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $query = [];

        if (! empty($params['job'])) {
            $query['search'] = $params['job'];
        }

        // Remotive is remote-only, but we can still pass category
        if (! empty($params['location']) && strtolower($params['location']) !== 'remote') {
            Log::info("[JobSource:{$this->sourceName}] Location filter '{$params['location']}' ignored — Remotive is remote-only");
        }

        $url = $this->config['base_url'];

        Log::info("[JobSource:{$this->sourceName}] Requesting Remotive API", ['url' => $url]);

        $response = $this->http()->get($url, $query);
        $response->throw();

        $data = $response->json();

        return $data['jobs'] ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => (string) ($raw['id'] ?? ''),
            'source'       => $this->sourceName,
            'title'        => $raw['title'] ?? '',
            'company'      => $raw['company_name'] ?? null,
            'location'     => $raw['candidate_required_location'] ?? 'Remote',
            'url'          => $raw['url'] ?? '',
            'description'  => strip_tags($raw['description'] ?? ''),
            'salary'       => $raw['salary'] ?? null,
            'tags'         => $raw['tags'] ?? null,
            'posted_at'    => $raw['publication_date'] ?? null,
        ];
    }
}
