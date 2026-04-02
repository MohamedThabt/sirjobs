<?php

namespace App\Services\JobSources\Rss;

use App\Services\JobSources\BaseJobSourceService;
use Illuminate\Support\Facades\Log;

class RemoteOkRssService extends BaseJobSourceService
{
    public function fetchJobs(array $params = []): array
    {
        $feedUrl = $this->config['feed_url'];

        Log::info("[JobSource:{$this->sourceName}] Fetching RSS feed", ['url' => $feedUrl]);

        $response = $this->http()
            ->withHeaders([
                'Accept'     => 'application/xml',
                'User-Agent' => 'SirJobs/1.0',
            ])
            ->get($feedUrl);

        $response->throw();

        return $this->parseRss($response->body(), $params);
    }

    protected function parseRss(string $xml, array $params = []): array
    {
        $feed = @simplexml_load_string($xml);

        if (! $feed) {
            Log::error("[JobSource:{$this->sourceName}] Failed to parse RSS XML");
            return [];
        }

        $items = [];

        foreach ($feed->channel->item ?? [] as $item) {
            $raw = [
                'title'       => (string) $item->title,
                'link'        => (string) $item->link,
                'description' => (string) ($item->description ?? ''),
                'pubDate'     => (string) ($item->pubDate ?? ''),
                'guid'        => (string) ($item->guid ?? $item->link),
            ];

            // Client-side keyword filter
            if (! empty($params['job'])) {
                $keyword = strtolower($params['job']);
                if (! str_contains(strtolower($raw['title']), $keyword)
                    && ! str_contains(strtolower($raw['description']), $keyword)) {
                    continue;
                }
            }

            $items[] = $raw;
        }

        return $items;
    }

    protected function normalizeJob(array $raw): array
    {
        return [
            'external_id' => md5($raw['guid'] ?? $raw['link']),
            'source'       => $this->sourceName,
            'title'        => $raw['title'] ?? '',
            'company'      => null,
            'location'     => 'Remote',
            'url'          => $raw['link'] ?? '',
            'description'  => strip_tags($raw['description'] ?? ''),
            'salary'       => null,
            'tags'         => null,
            'posted_at'    => ! empty($raw['pubDate']) ? date('Y-m-d H:i:s', strtotime($raw['pubDate'])) : null,
        ];
    }
}
