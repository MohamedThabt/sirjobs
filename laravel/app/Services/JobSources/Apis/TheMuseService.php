<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class TheMuseService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $apiKey = $this->config['api_key'] ?? null;

        $query = [
            'page' => 0,
        ];

        if ($apiKey) {
            $query['api_key'] = $apiKey;
        }

        if (! empty($params['job'])) {
            // The Muse uses 'category' not free-text search
            $query['category'] = $params['job'];
        }

        if (! empty($params['location'])) {
            $query['location'] = $params['location'];
        }

        $url = $this->config['base_url'];

        Log::info("[JobSource:{$this->sourceName}] Requesting The Muse API", ['url' => $url]);

        $response = $this->http()->get($url, $query);
        $response->throw();

        $data = $response->json();

        return $data['results'] ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        $locations = collect($raw['locations'] ?? [])
            ->pluck('name')
            ->implode(', ');

        return [
            'external_id' => (string) ($raw['id'] ?? ''),
            'source'       => $this->sourceName,
            'title'        => $raw['name'] ?? '',
            'company'      => $raw['company']['name'] ?? null,
            'location'     => $locations ?: null,
            'url'          => $raw['refs']['landing_page'] ?? '',
            'description'  => strip_tags($raw['contents'] ?? ''),
            'salary'       => null,
            'tags'         => collect($raw['categories'] ?? [])->pluck('name')->all() ?: null,
            'posted_at'    => $raw['publication_date'] ?? null,
        ];
    }
}
