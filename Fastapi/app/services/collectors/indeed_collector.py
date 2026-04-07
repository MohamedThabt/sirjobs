"""Indeed job collector — powered by jobspy."""

from __future__ import annotations

from app.models.schemas import CollectJobsRequest, JobListingResponse
from app.services.base_collector import BaseCollectorService
from app.services.collectors.jobspy_helpers import async_scrape_jobs, jobspy_df_to_listings

# Map ISO-2 codes → full country names expected by jobspy
_COUNTRY_CODE_MAP: dict[str, str] = {
    "eg": "egypt",
    "us": "usa",
    "gb": "uk",
    "uk": "uk",
    "ae": "united arab emirates",
    "sa": "saudi arabia",
    "kw": "kuwait",
    "qa": "qatar",
    "bh": "bahrain",
    "om": "oman",
    "jo": "jordan",
    "ca": "canada",
    "au": "australia",
    "de": "germany",
    "fr": "france",
    "in": "india",
    "ng": "nigeria",
    "pk": "pakistan",
    "ph": "philippines",
    "sg": "singapore",
    "za": "south africa",
    "ma": "morocco",
}


class IndeedCollectorService(BaseCollectorService):
    source_name = "indeed"
    region = "global"
    supports_native_date_filter = True

    async def _collect(self, params: CollectJobsRequest) -> list[JobListingResponse]:
        kwargs: dict = {
            "site_name": ["indeed"],
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
        if params.effective_hours_old:
            kwargs["hours_old"] = params.effective_hours_old
        if params.country_indeed:
            # Normalize ISO-2 codes to full names jobspy understands
            country = _COUNTRY_CODE_MAP.get(
                params.country_indeed.lower(), params.country_indeed
            )
            kwargs["country_indeed"] = country

        df = await async_scrape_jobs(kwargs)
        return jobspy_df_to_listings(df, self.source_name, self.region)
