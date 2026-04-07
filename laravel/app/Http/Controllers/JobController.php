<?php

namespace App\Http\Controllers;

use App\Models\JobListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'location'     => 'nullable|string|max:200',
            'source'       => 'nullable|array',
            'source.*'     => 'string|max:100',
            'time'         => ['nullable', 'string', 'regex:/^\d+(h|d)$/'],
            'role'         => 'nullable|string|max:100',
            'tags'         => 'nullable|array',
            'tags.*'       => 'string|max:100',
            'remote'       => 'nullable',
        ]);

        $location    = $request->query('location');
        $sources     = $request->query('source', []);
        $time        = $request->query('time');
        $role        = $request->query('role');
        $tags        = $request->query('tags', []);
        $remote      = $request->query('remote') === 'true';

        if (is_string($sources)) {
            $sources = array_filter(explode(',', $sources));
        }
        if (is_string($tags)) {
            $tags = array_filter(explode(',', $tags));
        }

        $postedHours = null;
        $postedDays  = null;

        if (is_string($time) && preg_match('/^(\d+)(h|d)$/', $time, $matches)) {
            $value = (int) $matches[1];
            $unit  = $matches[2];

            match ($unit) {
                'h' => $postedHours = $value,
                'd' => $postedDays = $value,
            };
        }

        if ($postedHours === null && $postedDays === null) {
            $postedDays = 2;
            $time = '2d';
        }

        $jobs = JobListing::query()
            ->location($location)
            ->source($sources)
            ->role($role)
            ->tags($tags)
            ->postedWithinHours($postedHours)
            ->postedWithinDays($postedDays)
            ->remoteOnly($remote)
            ->orderByDesc('posted_at')
            ->get();

        $allTags = JobListing::whereNotNull('tags')->pluck('tags');
        $availableTags = collect();
        foreach ($allTags as $tagsArray) {
            if (is_array($tagsArray)) {
                foreach ($tagsArray as $tag) {
                    if (is_string($tag)) {
                        $availableTags->push(strtolower($tag));
                    }
                }
            }
        }

        $filterOptions = [
            'locations' => JobListing::whereNotNull('location')
                ->where('location', '!=', '')
                ->select('location')
                ->distinct()
                ->pluck('location')
                ->sort()
                ->values()
                ->toArray(),
            'sources' => JobListing::select('source')
                ->distinct()
                ->pluck('source')
                ->sort()
                ->values()
                ->toArray(),
            'tags' => $availableTags->unique()->sort()->values()->toArray(),
        ];

        return Inertia::render('job/Index', [
            'jobs'          => $jobs,
            'filters'       => [
                'location' => $location,
                'source'   => $sources,
                'time'     => $time,
                'role'     => $role,
                'tags'     => $tags,
                'remote'   => $remote,
            ],
            'filterOptions' => $filterOptions,
        ]);
    }

    public function show(JobListing $job)
    {
        return Inertia::render('job/Show', [
            'job' => $job,
        ]);
    }
}
