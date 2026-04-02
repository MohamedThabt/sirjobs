"""API route definitions."""

from fastapi import APIRouter, Depends, Query, Request
from app.models.schemas import CollectJobsRequest, CollectJobsResponse
from app.controllers import job_collector_controller

router = APIRouter()


@router.get("/health")
async def health_check(request: Request):
    """Basic health check endpoint."""
    return {"status": "healthy"}


@router.get("/jobs/collect", response_model=CollectJobsResponse)
async def collect_jobs(
    search_term: str | None = None,
    location: str | None = None,
    results_wanted: int = Query(default=20, ge=1, le=200),
    job_type: str | None = None,
    country_indeed: str | None = None,
    hours_old: int | None = None,
    is_remote: bool | None = None,
    google_search_term: str | None = None,
    linkedin_fetch_description: bool = False,
    description_format: str = "markdown",
    sites: str | None = Query(
        default=None,
        description="Comma-separated site names to filter, e.g. 'linkedin,indeed,wuzzuf'",
    ),
):
    """Collect jobs from all (or filtered) supported job board sites.

    Returns an aggregated list of job listings matching the Laravel
    ``job_listings`` table schema, plus a per-source status summary.
    """
    # Parse comma-separated sites into a list
    sites_list = (
        [s.strip() for s in sites.split(",") if s.strip()]
        if sites
        else None
    )

    params = CollectJobsRequest(
        search_term=search_term,
        location=location,
        results_wanted=results_wanted,
        job_type=job_type,
        country_indeed=country_indeed,
        hours_old=hours_old,
        is_remote=is_remote,
        google_search_term=google_search_term,
        linkedin_fetch_description=linkedin_fetch_description,
        description_format=description_format,
        sites=sites_list,
    )

    return await job_collector_controller.collect_all(params)
