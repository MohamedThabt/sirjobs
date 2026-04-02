"""Forasna.com job collector — httpx + BeautifulSoup scraper.

Forasna uses the same BasharSoft engine as Wuzzuf, so the HTML
structure is similar.
"""

from __future__ import annotations

import hashlib
from urllib.parse import quote_plus, urljoin

import httpx
from bs4 import BeautifulSoup

from app.models.schemas import CollectJobsRequest, JobListingResponse
from app.services.base_collector import BaseCollectorService
from config.logger import get_logger

logger = get_logger()

BASE_URL = "https://www.forasna.com"
SEARCH_URL = f"{BASE_URL}/jobs/search"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


class ForasnaCollectorService(BaseCollectorService):
    source_name = "forasna"
    region = "egypt"

    async def _collect(self, params: CollectJobsRequest) -> list[JobListingResponse]:
        jobs: list[JobListingResponse] = []
        collected = 0
        page = 1

        async with httpx.AsyncClient(headers=HEADERS, timeout=30, follow_redirects=True) as client:
            while collected < params.results_wanted:
                url_params = f"?page={page}"
                if params.search_term:
                    url_params += f"&q={quote_plus(params.search_term)}"

                url = SEARCH_URL + url_params
                logger.debug(f"Forasna: fetching page {page} — {url}",
                             extra={"collector_source": self.source_name})

                resp = await client.get(url)
                resp.raise_for_status()

                soup = BeautifulSoup(resp.text, "lxml")
                cards = soup.select("div.job-card, div.job-listing, article.job, div[class*='job-item']")

                if not cards:
                    logger.info(f"Forasna: no more results at page {page}",
                                extra={"collector_source": self.source_name})
                    break

                for card in cards:
                    if collected >= params.results_wanted:
                        break
                    job = self._parse_card(card)
                    if job:
                        jobs.append(job)
                        collected += 1

                page += 1

        return jobs

    def _parse_card(self, card) -> JobListingResponse | None:
        try:
            title_el = card.select_one("h2 a, a.job-title, h3 a")
            if not title_el:
                return None
            title = title_el.get_text(strip=True)
            job_url = urljoin(BASE_URL, title_el.get("href", ""))

            company_el = card.select_one("span.company, a.company-name, div.company")
            company = company_el.get_text(strip=True) if company_el else None

            loc_el = card.select_one("span.location, div.location")
            location = loc_el.get_text(strip=True) if loc_el else None

            date_el = card.select_one("span.date, time, div.post-date")
            posted_at = date_el.get_text(strip=True) if date_el else None

            external_id = hashlib.md5(job_url.encode()).hexdigest()[:16]

            return JobListingResponse(
                external_id=external_id,
                source=self.source_name,
                title=title,
                company=company,
                location=location,
                region=self.region,
                url=job_url,
                description=None,
                salary=None,
                tags=None,
                posted_at=posted_at,
            )
        except Exception as exc:
            logger.warning(f"Forasna: failed to parse card — {exc}",
                           extra={"collector_source": self.source_name})
            return None
