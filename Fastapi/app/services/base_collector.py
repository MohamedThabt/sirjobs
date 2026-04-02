"""Abstract base class for all job collector services."""

from __future__ import annotations

import time
import traceback
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from config.logger import get_logger

if TYPE_CHECKING:
    from app.models.schemas import CollectJobsRequest, JobListingResponse

logger = get_logger()


class BaseCollectorService(ABC):
    """Every collector inherits from this.

    Subclasses must set ``source_name`` and ``region``, and implement
    the ``_collect`` coroutine.
    """

    source_name: str = ""
    region: str = "global"

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    async def collect(
        self, params: CollectJobsRequest
    ) -> list[JobListingResponse]:
        """Run the collector with logging & error handling."""
        start = time.perf_counter()
        try:
            logger.info(
                "Collector started",
                extra={
                    "collector_source": self.source_name,
                    "collector_region": self.region,
                    "collector_status": "started",
                },
            )

            jobs = await self._collect(params)

            elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.info(
                "Collector finished successfully",
                extra={
                    "collector_source": self.source_name,
                    "collector_region": self.region,
                    "collector_status": "success",
                    "jobs_collected": len(jobs),
                    "collector_duration_ms": elapsed_ms,
                },
            )
            return jobs

        except Exception as exc:  # noqa: BLE001
            elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
            logger.error(
                f"Collector failed: {exc}",
                extra={
                    "collector_source": self.source_name,
                    "collector_region": self.region,
                    "collector_status": "failed",
                    "collector_error": str(exc),
                    "collector_duration_ms": elapsed_ms,
                },
            )
            logger.debug(
                f"Collector traceback: {traceback.format_exc()}",
                extra={"collector_source": self.source_name},
            )
            return []

    # ------------------------------------------------------------------
    # Subclass hook
    # ------------------------------------------------------------------
    @abstractmethod
    async def _collect(
        self, params: CollectJobsRequest
    ) -> list[JobListingResponse]:
        """Perform the actual scraping / API call.

        Implementations should return a list of ``JobListingResponse``
        instances.  Any exception raised here is caught by ``collect()``.
        """
        ...

    # ------------------------------------------------------------------
    # Helpers shared across collectors
    # ------------------------------------------------------------------
    def _build_salary_string(
        self,
        min_amount: float | None,
        max_amount: float | None,
        currency: str | None = None,
        interval: str | None = None,
    ) -> str | None:
        """Format min/max salary into a human-readable string."""
        if min_amount is None and max_amount is None:
            return None
        parts: list[str] = []
        cur = currency or ""
        if min_amount is not None and max_amount is not None:
            parts.append(f"{cur}{min_amount:,.0f} – {cur}{max_amount:,.0f}")
        elif min_amount is not None:
            parts.append(f"{cur}{min_amount:,.0f}+")
        else:
            parts.append(f"Up to {cur}{max_amount:,.0f}")
        if interval:
            parts.append(f"/ {interval}")
        return " ".join(parts)
