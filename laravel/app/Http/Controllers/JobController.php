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
     * Display job listings. Fetches from all active sources, persists to DB,
     * then queries the DB with optional filters.
     */
    public function index(Request $request)
    {
        $job      = $request->query('job');
        $location = $request->query('location');

        Log::info('[JobController] Jobs page requested', [
            'job'      => $job,
            'location' => $location,
        ]);

        // Trigger collection from all active sources
        $manager = new JobSourceManager();
        $collectionResult = $manager->collectAll([
            'job'      => $job,
            'location' => $location,
        ]);

        Log::info('[JobController] Collection result', $collectionResult);

        // Query persisted jobs from the database with filters
        $jobs = JobListing::query()
            ->search($job)
            ->location($location)
            ->orderByDesc('posted_at')
            ->limit(200)
            ->get();

        return Inertia::render('job/Index', [
            'jobs'    => $jobs,
            'filters' => [
                'job'      => $job,
                'location' => $location,
            ],
            'stats'   => [
                'total_collected' => $collectionResult['total'],
                'sources'         => $collectionResult['sources'],
                'errors'          => $collectionResult['errors'],
            ],
        ]);
    }
}
