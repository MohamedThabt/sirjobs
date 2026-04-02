<?php

namespace App\Services\JobSources\Apis;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class HackerNewsService extends BaseJobSourceService
{
    /**
     * Fetch jobs from HN API.
     * Endpoint 1: /jobstories.json (array of IDs)
     * Endpoint 2: /item/{id}.json (details for each job)
     */
    public function fetchJobs(array $params = []): array
    {
        $baseUrl = $this->config['base_url'] ?? 'https://hacker-news.firebaseio.com/v0';

        // 1. Fetch Job IDs
        $response = $this->http()->get("{$baseUrl}/jobstories.json");

        if (!$response->successful()) {
            throw new \Exception("Hacker News API error: {$response->status()} - {$response->body()}");
        }

        $jobIds = $response->json();
        if (!is_array($jobIds) || empty($jobIds)) {
            Log::info("[JobSource:{$this->sourceName}] No job stories returned from HN.");
            return [];
        }

        $rawJobs = [];
        // Limit to 50 jobs at most per run to avoid excessive API calls if the array is huge
        $jobIds = array_slice($jobIds, 0, 50);

        // 2. Fetch each job's details
        // Note: For a high volume, concurrent requests (e.g. Http::pool) would be better,
        // but since HN job stories is usually a small list (~30), sequential or semi-sequential is fine.
        $responses = Http::pool(function ($pool) use ($baseUrl, $jobIds) {
            foreach ($jobIds as $id) {
                $pool->as((string)$id)->get("{$baseUrl}/item/{$id}.json");
            }
        });

        foreach ($responses as $id => $resp) {
            if ($resp instanceof \Illuminate\Http\Client\Response && $resp->successful()) {
                $item = $resp->json();
                if ($item && isset($item['type']) && $item['type'] === 'job') {
                    $rawJobs[] = $item;
                }
            } else {
                Log::warning("[JobSource:{$this->sourceName}] Failed to fetch HN item {$id}");
            }
        }

        return $rawJobs;
    }

    /**
     * Map a raw HN item into standard Job format.
     */
    protected function normalizeJob(array $raw): array
    {
        // HN job title format might be:
        // "Company (YC S21) is hiring engineers"
        $title = $raw['title'] ?? 'Unknown Title';
        
        // Attempt to extract company name from the title if possible, though it's unstructured
        $company = null;
        if (preg_match('/^(.*?)\s+(is hiring|is looking for)/i', $title, $matches)) {
            $company = trim($matches[1]);
        }

        return [
            'source'      => $this->sourceName,
            'external_id' => (string)($raw['id'] ?? Str::uuid()),
            'title'       => $title,
            'company'     => $company,
            'location'    => null, // HN rarely provides structured location
            'url'         => $raw['url'] ?? "https://news.ycombinator.com/item?id=" . ($raw['id'] ?? ''),
            // HN content is optionally in 'text', formatted as HTML
            'description' => $raw['text'] ?? null,
            'salary'      => null,
            'tags'        => ['startup', 'yc'], // Generally these are YC companies or startups
            'posted_at'   => isset($raw['time']) ? date('Y-m-d H:i:s', $raw['time']) : now()->toDateTimeString(),
        ];
    }
}
