<?php

namespace App\Console\Commands;

use App\Services\JobSourceManager;
use Illuminate\Console\Command;

class CollectTechJobs extends Command
{
    protected $signature = 'jobs:collect-tech';

    protected $description = 'Collect tech-related jobs from all active sources (last 3 days)';

    private const SEARCH_TERMS = [
        'software engineer',
        'backend developer',
        'frontend developer',
        'full stack developer',
        'devops engineer',
        'data scientist',
        'machine learning engineer',
        'mobile developer',
        'cloud engineer',
        'QA engineer',
        'security engineer',
        'web developer',
    ];

    public function handle(JobSourceManager $manager): int
    {
        $this->info('Starting global tech jobs collection...');

        $totalCollected = 0;
        $allErrors = [];

        foreach (self::SEARCH_TERMS as $term) {
            $this->line("  Collecting: {$term}");

            $result = $manager->collectAll([
                'keywords'    => [$term],
                'posted_days' => 3,
            ]);

            $count = $result['total'] ?? 0;
            $totalCollected += $count;
            $this->line("    → {$count} jobs");

            if (! empty($result['errors'])) {
                $allErrors = array_merge($allErrors, $result['errors']);
            }
        }

        $pruned = $manager->pruneOlderThan(3);
        $this->line("  Pruned {$pruned} expired jobs (older than 3 days)");

        $this->info("Collection complete: {$totalCollected} jobs collected, " . count($allErrors) . ' error(s)');

        if (! empty($allErrors)) {
            $this->warn('Errors:');
            foreach ($allErrors as $err) {
                $this->warn("  [{$err['source']}] {$err['error']}");
            }
        }

        return self::SUCCESS;
    }
}
