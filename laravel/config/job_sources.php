<?php

return [

    /*
    |--------------------------------------------------------------------------
    | This is the single source of truth for all job source configuration.
    | Toggle sources on/off, change URLs, rotate keys — all here, no code changes.
    |--------------------------------------------------------------------------
    */

    'adzuna' => [
        'driver'   => 'adzuna',
        'active'   => true,
        'base_url' => 'https://api.adzuna.com/v1/api/jobs',
        'country'  => env('ADZUNA_COUNTRY', 'gb'),
        'app_id'   => env('ADZUNA_APP_ID'),
        'app_key'  => env('ADZUNA_APP_KEY'),
    ],

    'remotive' => [
        'driver'   => 'remotive',
        'active'   => true,
        'base_url' => 'https://remotive.com/api/remote-jobs',
    ],

    'reed_api' => [
        'driver'   => 'reed_api',
        'active'   => true,
        'base_url' => 'https://www.reed.co.uk/api/1.0/search',
        'api_key'  => env('REED_API_KEY'),
    ],

    'the_muse' => [
        'driver'   => 'the_muse',
        'active'   => true,
        'base_url' => 'https://www.themuse.com/api/public/jobs',
        'api_key'  => env('THE_MUSE_API_KEY'),
    ],

    'arbeitnow' => [
        'driver'   => 'arbeitnow',
        'active'   => true,
        'base_url' => 'https://www.arbeitnow.com/api/job-board-api',
    ],

    'reed_rss' => [
        'driver'    => 'rss',
        'active'    => true,
        'feed_url'  => 'https://www.reed.co.uk/jobs/software-engineer/rss',
        'source_name' => 'reed_rss',
    ],

    'remoteok_rss' => [
        'driver'    => 'rss',
        'active'    => true,
        'feed_url'  => 'https://remoteok.com/remote-software-dev-jobs.rss',
        'source_name' => 'remoteok_rss',
    ],

    'working_nomads_rss' => [
        'driver'    => 'rss',
        'active'    => false,           // ← easy on/off toggle
        'feed_url'  => 'https://www.workingnomads.com/feed?category=development',
        'source_name' => 'working_nomads_rss',
    ],

    'serpapi_google_jobs' => [
        'driver'   => 'serpapi',
        'active'   => false,            // paid — off by default
        'base_url' => 'https://serpapi.com/search',
        'api_key'  => env('SERPAPI_KEY'),
    ],

    'jobicy' => [
        'driver'   => 'jobicy',
        'active'   => true,
        'base_url' => 'https://jobicy.com/api/v2/remote-jobs',
        'count'    => 50,
    ],

    'hacker_news' => [
        'driver'   => 'hacker_news',
        'active'   => true,
        'base_url' => 'https://hacker-news.firebaseio.com/v0',
    ],

    'fastapi_collector' => [
        'driver'          => 'fastapi_collector',
        'active'          => true,
        'base_url'        => env('FASTAPI_COLLECTOR_URL', 'http://127.0.0.1:8005/api'),
        'timeout'         => 120,
    ],

];
