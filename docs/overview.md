# Project Overview

## What This Project Is

SirJobs is a job aggregation platform built with Laravel and a React frontend (via Inertia).
It collects listings from multiple external providers (APIs, RSS feeds, and aggregators), normalizes them into a single schema, stores them in the local database, and serves a searchable/filterable job board UI.

## Core Goals

- Aggregate jobs from many sources in one place.
- Avoid duplicates by upserting jobs per source + external ID.
- Provide fast browsing with filters for keyword, location, source, and remote-only.
- Keep source configuration centralized and easy to toggle.

## High-Level Architecture

1. Web routes point to controllers and Inertia pages.
2. `JobController` handles listing, detail view, and manual refresh.
3. `JobSourceManager` resolves active sources from config and runs collection.
4. Each source service fetches raw jobs and normalizes to a common structure.
5. `BaseJobSourceService` persists normalized jobs into `job_listings`.
6. React pages render the final data returned by Inertia.

## Tech Stack

### Backend

- PHP 8.2+
- Laravel 12
- Inertia Laravel
- SQLite by default (local and tests), with queue tables enabled

### Frontend

- React 19 + TypeScript
- Inertia React
- Vite 6
- Tailwind CSS 4
- shadcn/ui + Radix UI components

### Tooling and Quality

- PHPUnit (test suites: Unit + Feature)
- ESLint + Prettier (frontend)
- Laravel Pint (PHP formatting)
- GitHub Actions workflows for lint and test pipelines

## Domain Model

### Main Entity: `job_listings`

Important fields:

- `source`
- `external_id`
- `title`
- `company`
- `location`
- `url`
- `description`
- `salary`
- `tags` (JSON)
- `posted_at`

Uniqueness is enforced on `source + external_id` to prevent duplicate entries per source.

## Job Source System

Source configuration is centralized in `config/job_sources.php`.

- API sources: Adzuna, Remotive, Reed API, The Muse, Arbeitnow, Hacker News
- Aggregator sources: Jobicy, SerpAPI Google Jobs (disabled by default)
- RSS sources: Reed RSS, RemoteOK RSS, Working Nomads RSS (currently disabled)

Each source has:

- A `driver` (or `rss` + `source_name`)
- `active` toggle
- Provider-specific URL and optional credentials

Required environment variables depend on enabled sources, for example:

- `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`
- `REED_API_KEY`
- `THE_MUSE_API_KEY`
- `SERPAPI_KEY` (if enabled)

## Main User Flows

### Public

- `/` landing page
- `/sources` sources page
- `/jobs` list jobs
- `/jobs/{job}` job details
- `POST /jobs/refresh` trigger a manual refresh

### Authenticated

- `/dashboard`
- Auth routes (login/register/password reset/email verification)
- Settings routes (profile, password, appearance)

## Local Development

### 1) Install dependencies

```bash
composer install
npm install
```

### 2) Environment setup

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

php artisan key:generate
```

### 3) Database setup

```bash
php artisan migrate
```

### 4) Start development servers

Option A (one command, runs app server + queue listener + logs + Vite):

```bash
composer run dev
```

Option B (manual split):

```bash
php artisan serve
npm run dev
```

## Common Commands

```bash
# Frontend
npm run dev
npm run build
npm run lint
npm run format

# Backend / tests
php artisan test
vendor/bin/phpunit
# Windows (PowerShell)
vendor\\bin\\phpunit
vendor/bin/pint
```

## CI/CD Snapshot

Two GitHub Actions workflows run on `develop` and `main` (push + pull request):

- `linter`: Composer + npm install, then Pint, Prettier, ESLint
- `tests`: Build frontend assets, prepare app key + SQLite, run PHPUnit

## Notes for Contributors

- Keep new source integrations inside `app/Services/JobSources`.
- Prefer using the existing normalization + persistence pipeline.
- Toggle source behavior in config before changing code.
- When adding fields to jobs, update migration/model/normalizers consistently.
