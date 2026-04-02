"""Job Collector Controller — orchestrates all collector services."""

from __future__ import annotations

import asyncio
import time

from app.models.schemas import (
    CollectJobsRequest,
    CollectJobsResponse,
    JobListingResponse,
    SourceResult,
)
from app.services.base_collector import BaseCollectorService
from app.services.collectors import ALL_COLLECTORS
from config.logger import get_logger

logger = get_logger()

# Pre-built mapping: source_name → collector class
_COLLECTOR_MAP: dict[str, type[BaseCollectorService]] = {
    cls.source_name: cls for cls in ALL_COLLECTORS  # type: ignore[attr-defined]
}


async def collect_all(params: CollectJobsRequest) -> CollectJobsResponse:
    """Run every (or filtered) collector concurrently and aggregate results."""
    start = time.perf_counter()

    # Decide which collectors to run
    if params.sites:
        requested = {s.lower().strip() for s in params.sites}
        collectors = [
            cls() for name, cls in _COLLECTOR_MAP.items()
            if name in requested
        ]
        if not collectors:
            available = ", ".join(sorted(_COLLECTOR_MAP.keys()))
            raise ValueError(
                f"No matching collectors for sites={params.sites}. "
                f"Available: {available}"
            )
    else:
        collectors = [cls() for cls in ALL_COLLECTORS]

    logger.info(
        f"Job collection started — {len(collectors)} collectors",
        extra={
            "collector_status": "batch_started",
            "total_collected": len(collectors),
        },
    )

    # Run all collectors concurrently
    tasks = [collector.collect(params) for collector in collectors]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Aggregate
    all_jobs: list[JobListingResponse] = []
    sources_summary: list[SourceResult] = []

    for collector, result in zip(collectors, results):
        if isinstance(result, Exception):
            sources_summary.append(
                SourceResult(
                    source=collector.source_name,
                    status="failed",
                    jobs_count=0,
                    error=str(result),
                )
            )
        else:
            job_list: list[JobListingResponse] = result  # type: ignore[assignment]
            all_jobs.extend(job_list)
            sources_summary.append(
                SourceResult(
                    source=collector.source_name,
                    status="success",
                    jobs_count=len(job_list),
                )
            )

    elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
    successful = [s.source for s in sources_summary if s.status == "success"]
    failed = [s.source for s in sources_summary if s.status == "failed"]

    logger.info(
        f"Job collection finished — {len(all_jobs)} jobs from {len(successful)} sources in {elapsed_ms}ms",
        extra={
            "collector_status": "batch_finished",
            "total_collected": len(all_jobs),
            "successful_sources": successful,
            "failed_sources": failed,
            "collector_duration_ms": elapsed_ms,
        },
    )

    return CollectJobsResponse(
        total_jobs=len(all_jobs),
        sources_summary=sources_summary,
        jobs=all_jobs,
    )
