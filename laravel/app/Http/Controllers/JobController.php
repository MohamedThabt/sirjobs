<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use App\Services\JobSourceManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display job listings. Only auto-collects if DB is empty.
     */
    public function index(Request $request)
    {
        $job      = $request->query('job');
        $location = $request->query('location');
        // Parse array of sources or just a single string, or default empty
        $sources  = $request->query('sources', []);
        $remote   = $request->query('remote') === 'true';

        if (is_string($sources)) {
            $sources = explode(',', $sources);
        }

        $collectionResult = null;

        // Auto-fetch if completely empty
        if (JobListing::count() === 0) {
            $manager = new JobSourceManager();
            $collectionResult = $manager->collectAll();
            Log::info('[JobController] DB was empty, performed auto-collection', $collectionResult);
        }

        // Available sources for filter UI
        $availableSources = JobListing::select('source')
            ->distinct()
            ->pluck('source')
            ->toArray();

        // Query persisted jobs from the database with filters
        $jobs = JobListing::query()
            ->search($job)
            ->location($location)
            ->source($sources)
            ->remoteOnly($remote)
            ->orderByDesc('posted_at')
            ->limit(200)
            ->get();

        return Inertia::render('job/Index', [
            'jobs'    => $jobs,
            'filters' => [
                'job'      => $job,
                'location' => $location,
                'sources'  => $sources,
                'remote'   => $remote,
            ],
            'availableSources' => $availableSources,
            'stats'   => $collectionResult, // Only present if auto-collected
        ]);
    }

    /**
     * Force a refresh from all sources and redirect back to index.
     */
    public function refresh(Request $request)
    {
        $manager = new JobSourceManager();
        $manager->collectAll();
        
        Log::info('[JobController] Manual refresh completed');

        return redirect()->route('jobs.index');
    }

    /**
     * Show a single job detail page.
     */
    public function show(JobListing $job)
    {
        return Inertia::render('job/Show', [
            'job' => $job,
        ]);
    }
}
