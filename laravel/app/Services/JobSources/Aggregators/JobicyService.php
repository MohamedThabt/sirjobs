<?php

namespace App\Services\JobSources\Aggregators;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class JobicyService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $url = $this->config['base_url'];

        $query = [
            'count' => $this->config['count'] ?? 50,
        ];

        if (! empty($params['job'])) {
            $query['tag'] = $params['job'];
        }

        if (! empty($params['location'])) {
            $query['geo'] = $params['location'];
        }

        Log::info("[JobSource:{$this->sourceName}] Requesting Jobicy API", ['url' => $url]);

        $response = $this->http()->get($url, $query);
        $response->throw();

        $data = $response->json();

        return $data['jobs'] ?? [];
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => (string) ($raw['id'] ?? md5($raw['url'] ?? '')),
            'source'       => $this->sourceName,
            'title'        => $raw['jobTitle'] ?? '',
            'company'      => $raw['companyName'] ?? null,
            'location'     => $raw['jobGeo'] ?? 'Remote',
            'url'          => $raw['url'] ?? '',
            'description'  => strip_tags($raw['jobExcerpt'] ?? ''),
            'salary'       => isset($raw['annualSalaryMin'])
                ? "{$raw['annualSalaryMin']} - " . ($raw['annualSalaryMax'] ?? '?')
                : null,
            'tags'         => ! empty($raw['jobIndustry']) ? [$raw['jobIndustry']] : null,
            'posted_at'    => $raw['pubDate'] ?? null,
        ];
    }
}
