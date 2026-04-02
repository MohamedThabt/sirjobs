"""Wuzzuf.net job collector — httpx + BeautifulSoup scraper."""

from __future__ import annotations

import hashlib
from urllib.parse import quote_plus, urljoin

import httpx
from bs4 import BeautifulSoup

from app.models.schemas import CollectJobsRequest, JobListingResponse
from app.services.base_collector import BaseCollectorService
from config.logger import get_logger

logger = get_logger()

BASE_URL = "https://wuzzuf.net"
SEARCH_URL = f"{BASE_URL}/search/jobs/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


class WuzzufCollectorService(BaseCollectorService):
    source_name = "wuzzuf"
    region = "egypt"

    async def _collect(self, params: CollectJobsRequest) -> list[JobListingResponse]:
        jobs: list[JobListingResponse] = []
        collected = 0
        page = 0

        async with httpx.AsyncClient(headers=HEADERS, timeout=30, follow_redirects=True) as client:
            while collected < params.results_wanted:
                url_params = f"?start={page}"
                if params.search_term:
                    url_params += f"&q={quote_plus(params.search_term)}"
                if params.location:
                    url_params += f"&a=hpb---{quote_plus(params.location)}---"

                url = SEARCH_URL + url_params
                logger.debug(f"Wuzzuf: fetching page {page} — {url}",
                             extra={"collector_source": self.source_name})

                resp = await client.get(url)
                resp.raise_for_status()

                soup = BeautifulSoup(resp.text, "lxml")
                cards = soup.select("div.css-1gatmva, div.css-pkv5jc, div[class*='JobCard']")

                if not cards:
                    logger.info(f"Wuzzuf: no more results at page {page}",
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
        """Parse a single Wuzzuf job card."""
        try:
            # Title & URL
            title_el = card.select_one("h2 a, a.css-o171kl, a[class*='JobTitle']")
            if not title_el:
                return None
            title = title_el.get_text(strip=True)
            job_url = urljoin(BASE_URL, title_el.get("href", ""))

            # Company
            company_el = card.select_one("a.css-17s97q8, a[class*='Company'], div.css-d7j1kk a")
            company = company_el.get_text(strip=True) if company_el else None

            # Location
            loc_el = card.select_one("span.css-5wys0k, span[class*='Location']")
            location = loc_el.get_text(strip=True) if loc_el else None

            # Posted date
            date_el = card.select_one("div.css-4c4ojb, div[class*='PostDate'], span[class*='time']")
            posted_at = date_el.get_text(strip=True) if date_el else None

            # Tags (job type, experience, etc.)
            tag_els = card.select("a.css-o1vzmt, span.css-1ve4b75, div[class*='Tag'] span")
            tags = [t.get_text(strip=True) for t in tag_els] if tag_els else None

            external_id = hashlib.md5(job_url.encode()).hexdigest()[:16]

            return JobListingResponse(
                external_id=external_id,
                source=self.source_name,
                title=title,
                company=company,
                location=location,
                region=self.region,
                url=job_url,
                description=None,  # Description requires visiting each job page
                salary=None,
                tags=tags,
                posted_at=posted_at,
            )
        except Exception as exc:
            logger.warning(f"Wuzzuf: failed to parse card — {exc}",
                           extra={"collector_source": self.source_name})
            return None
