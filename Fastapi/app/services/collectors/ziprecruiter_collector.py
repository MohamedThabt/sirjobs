"""ZipRecruiter job collector — powered by jobspy."""

from __future__ import annotations

from app.models.schemas import CollectJobsRequest, JobListingResponse
from app.services.base_collector import BaseCollectorService
from app.services.collectors.jobspy_helpers import async_scrape_jobs, jobspy_df_to_listings


class ZipRecruiterCollectorService(BaseCollectorService):
    source_name = "zip_recruiter"
    region = "global"

    async def _collect(self, params: CollectJobsRequest) -> list[JobListingResponse]:
        kwargs: dict = {
            "site_name": ["zip_recruiter"],
            "results_wanted": params.results_wanted,
            "description_format": params.description_format,
            "verbose": 0,
        }
        if params.search_term:
            kwargs["search_term"] = params.search_term
        if params.location:
            kwargs["location"] = params.location
        if params.job_type:
            kwargs["job_type"] = params.job_type
        if params.is_remote is not None:
            kwargs["is_remote"] = params.is_remote
        if params.hours_old:
            kwargs["hours_old"] = params.hours_old

        df = await async_scrape_jobs(kwargs)
        return jobspy_df_to_listings(df, self.source_name, self.region)
