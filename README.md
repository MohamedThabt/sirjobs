# SirJobs Installation and Run Guide

## What This Project Does

SirJobs is a job aggregation platform focused on the tech industry.

It collects latest and hottest tech jobs from multiple external sources (APIs, RSS, and scraping providers), normalizes all records to one schema, and stores them in the Laravel database (`job_listings`) for browsing, searching, and filtering.

Laravel is the main application and database layer.
FastAPI is a collector service that fetches jobs from multiple job sites and returns unified data to Laravel.

## Project Structure

- `laravel/` main web app, database, UI, and orchestration
- `fastapi/` job collection service (`/api/jobs/collect`)
- `docs/` additional technical documentation

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+ and npm
- Python 3.11+ (recommended)
- Git

## 1) Laravel Setup

Run all commands from `laravel/`.

### Install dependencies

```bash
composer install
npm install
```

### Configure environment

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env

php artisan key:generate
```

### Configure database and migrate

Update database settings in `.env`, then run:

```bash
php artisan migrate
```

### Point Laravel to FastAPI collector

Add this to `laravel/.env`:

```env
FASTAPI_COLLECTOR_URL=http://127.0.0.1:8005/api
```

## 2) FastAPI Setup

Run all commands from `fastapi/`.

### Create and activate virtual environment

```bash
# Windows PowerShell
python -m venv .venv
.venv\Scripts\Activate.ps1

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### Install Python dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Configure FastAPI environment

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

## 3) Run the Applications

Open 2 terminals.

### Terminal A: FastAPI

From `fastapi/`:

```bash
uvicorn main:app --host 127.0.0.1 --port 8005 --reload
```

FastAPI endpoints:

- Health/root: `http://127.0.0.1:8005/`
- API docs (dev mode): `http://127.0.0.1:8005/docs`
- Job collector: `http://127.0.0.1:8005/api/jobs/collect`

### Terminal B: Laravel

From `laravel/`:

```bash
composer run dev
```

This runs Laravel app + queue + logs + Vite watcher.

Alternative split commands:

```bash
php artisan serve
npm run dev
```

Laravel app URL:

- `http://127.0.0.1:8000`

## 4) Verify Integration

1. Ensure FastAPI is running on port `8005`.
2. Ensure Laravel `.env` has `FASTAPI_COLLECTOR_URL=http://127.0.0.1:8005/api`.
3. Trigger a job collection flow from Laravel.
4. Confirm records are stored in `job_listings`.

## Useful Commands

From `laravel/`:

```bash
php artisan test
npm run build
```

From `fastapi/`:

```bash
pytest
```

