"""Bayt.com job collector — powered by jobspy (native support)."""

from __future__ import annotations

from app.models.schemas import CollectJobsRequest, JobListingResponse
from app.services.base_collector import BaseCollectorService
from app.services.collectors.jobspy_helpers import async_scrape_jobs, jobspy_df_to_listings


class BaytCollectorService(BaseCollectorService):
    source_name = "bayt"
    region = "middle_east"

    async def _collect(self, params: CollectJobsRequest) -> list[JobListingResponse]:
        kwargs: dict = {
            "site_name": ["bayt"],
            "results_wanted": params.results_wanted,
            "description_format": params.description_format,
            "verbose": 0,
        }
        if params.search_term:
            kwargs["search_term"] = params.search_term
        if params.location:
            kwargs["location"] = params.location

        df = await async_scrape_jobs(kwargs)
        return jobspy_df_to_listings(df, self.source_name, self.region)
