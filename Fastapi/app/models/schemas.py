"""Pydantic schemas for job collector request/response models."""

from __future__ import annotations

from pydantic import BaseModel, Field


class JobListingResponse(BaseModel):
    """Single job listing — mirrors the Laravel job_listings table."""

    external_id: str | None = None
    source: str  # "linkedin", "indeed", "wuzzuf", etc.
    title: str
    company: str | None = None
    location: str | None = None
    region: str | None = None  # "global", "egypt", "middle_east", "gulf"
    url: str
    description: str | None = None
    salary: str | None = None
    tags: list[str] | None = None
    posted_at: str | None = None  # ISO-8601 datetime string


class CollectJobsRequest(BaseModel):
    """Query parameters accepted by the /jobs/collect endpoint."""

    search_term: str | None = None
    location: str | None = None
    results_wanted: int = Field(default=20, ge=1, le=200)
    job_type: str | None = None  # fulltime, parttime, internship, contract
    country_indeed: str | None = None
    hours_old: int | None = None
    is_remote: bool | None = None
    google_search_term: str | None = None
    linkedin_fetch_description: bool = False
    description_format: str = "markdown"
    sites: list[str] | None = None  # filter to specific site names; None = all


class SourceResult(BaseModel):
    """Result summary for a single collector source."""

    source: str
    status: str  # "success" or "failed"
    jobs_count: int = 0
    error: str | None = None
    duration_ms: float = 0


class CollectJobsResponse(BaseModel):
    """Aggregated response from all collectors."""

    total_jobs: int
    sources_summary: list[SourceResult]
    jobs: list[JobListingResponse]
