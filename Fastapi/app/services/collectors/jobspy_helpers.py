"""Shared helper: convert a jobspy DataFrame into JobListingResponse list."""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

import pandas as pd

if TYPE_CHECKING:
    from app.models.schemas import CollectJobsRequest

from app.models.schemas import JobListingResponse


def jobspy_df_to_listings(
    df: pd.DataFrame,
    source_name: str,
    region: str,
) -> list[JobListingResponse]:
    """Map a jobspy result DataFrame to a list of JobListingResponse."""

    jobs: list[JobListingResponse] = []
    if df is None or df.empty:
        return jobs

    for _, row in df.iterrows():
        # Build salary string
        salary = _format_salary(row)

        # Build tags from job_type + job_function if present
        tags: list[str] = []
        if pd.notna(row.get("job_type")):
            tags.append(str(row["job_type"]))
        if pd.notna(row.get("job_function")):
            tags.append(str(row["job_function"]))
        if pd.notna(row.get("company_industry")):
            tags.append(str(row["company_industry"]))

        # Build location string
        loc_parts = []
        for key in ("city", "state", "country"):
            val = row.get(key) if pd.notna(row.get(key)) else None  # type: ignore[arg-type]
            if val:
                loc_parts.append(str(val))
        location = ", ".join(loc_parts) if loc_parts else (
            str(row.get("location")) if pd.notna(row.get("location")) else None
        )

        posted_at = None
        if pd.notna(row.get("date_posted")):
            posted_at = str(row["date_posted"])

        jobs.append(
            JobListingResponse(
                external_id=str(row.get("id")) if pd.notna(row.get("id")) else None,
                source=source_name,
                title=str(row.get("title", "")),
                company=str(row.get("company")) if pd.notna(row.get("company")) else None,
                location=location,
                region=region,
                url=str(row.get("job_url", "")),
                description=str(row.get("description")) if pd.notna(row.get("description")) else None,
                salary=salary,
                tags=tags if tags else None,
                posted_at=posted_at,
            )
        )

    return jobs


def _format_salary(row: pd.Series) -> str | None:
    """Format salary from jobspy row columns."""
    min_amt = row.get("min_amount") if pd.notna(row.get("min_amount")) else None
    max_amt = row.get("max_amount") if pd.notna(row.get("max_amount")) else None
    if min_amt is None and max_amt is None:
        return None
    currency = str(row.get("currency", "")) if pd.notna(row.get("currency")) else ""
    interval = str(row.get("interval", "")) if pd.notna(row.get("interval")) else ""
    parts: list[str] = []
    if min_amt is not None and max_amt is not None:
        parts.append(f"{currency}{min_amt:,.0f} – {currency}{max_amt:,.0f}")
    elif min_amt is not None:
        parts.append(f"{currency}{min_amt:,.0f}+")
    else:
        parts.append(f"Up to {currency}{max_amt:,.0f}")
    if interval:
        parts.append(f"/ {interval}")
    return " ".join(parts)


def run_jobspy_scrape(scrape_kwargs: dict) -> pd.DataFrame:
    """Run jobspy scrape_jobs synchronously (it's not async-friendly)."""
    from jobspy import scrape_jobs
    return scrape_jobs(**scrape_kwargs)


async def async_scrape_jobs(scrape_kwargs: dict) -> pd.DataFrame:
    """Run jobspy in a thread pool to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, run_jobspy_scrape, scrape_kwargs)
