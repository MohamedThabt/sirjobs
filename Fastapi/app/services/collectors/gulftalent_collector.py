"""GulfTalent.com job collector — Playwright + BeautifulSoup scraper.

GulfTalent uses heavy JavaScript rendering.
"""

from __future__ import annotations

import asyncio
import hashlib
from urllib.parse import quote_plus

from bs4 import BeautifulSoup

from app.models.schemas import CollectJobsRequest, JobListingResponse
from app.services.base_collector import BaseCollectorService
from config.logger import get_logger

logger = get_logger()

BASE_URL = "https://www.gulftalent.com"


class GulfTalentCollectorService(BaseCollectorService):
    source_name = "gulftalent"
    region = "gulf"

    async def _collect(self, params: CollectJobsRequest) -> list[JobListingResponse]:
        from playwright.async_api import async_playwright

        jobs: list[JobListingResponse] = []

        search_path = "/jobs/search"
        url_params = ""
        if params.search_term:
            url_params += f"?keywords={quote_plus(params.search_term)}"
        if params.location:
            sep = "&" if url_params else "?"
            url_params += f"{sep}location={quote_plus(params.location)}"

        url = f"{BASE_URL}{search_path}{url_params}"

        logger.debug(f"GulfTalent: launching browser for {url}",
                     extra={"collector_source": self.source_name})

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            try:
                context = await browser.new_context(
                    user_agent=(
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/131.0.0.0 Safari/537.36"
                    )
                )
                page = await context.new_page()
                await page.goto(url, wait_until="networkidle", timeout=45000)

                # Wait for job cards to appear
                try:
                    await page.wait_for_selector(
                        "div.job-card, tr.job-row, div[class*='listing'], div[class*='JobCard']",
                        timeout=15000,
                    )
                except Exception:
                    logger.warning("GulfTalent: job card selector timed out, using current DOM",
                                   extra={"collector_source": self.source_name})

                # Scroll to trigger lazy-loaded content
                for _ in range(3):
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    await asyncio.sleep(1.5)

                html = await page.content()
            finally:
                await browser.close()

        soup = BeautifulSoup(html, "lxml")
        cards = soup.select(
            "div.job-card, tr.job-row, "
            "div[class*='listing'], div[class*='JobCard'], "
            "div.search-result"
        )

        logger.debug(f"GulfTalent: found {len(cards)} cards",
                     extra={"collector_source": self.source_name})

        collected = 0
        for card in cards:
            if collected >= params.results_wanted:
                break
            job = self._parse_card(card)
            if job:
                jobs.append(job)
                collected += 1

        return jobs

    def _parse_card(self, card) -> JobListingResponse | None:
        try:
            title_el = card.select_one("a.job-title, h2 a, h3 a, a[class*='title'], td a")
            if not title_el:
                return None
            title = title_el.get_text(strip=True)
            href = title_el.get("href", "")
            job_url = href if href.startswith("http") else f"{BASE_URL}{href}"

            company_el = card.select_one(
                "span.company, a.company, td.company, "
                "div[class*='company'], span[class*='employer']"
            )
            company = company_el.get_text(strip=True) if company_el else None

            loc_el = card.select_one(
                "span.location, td.location, "
                "div[class*='location'], span[class*='country']"
            )
            location = loc_el.get_text(strip=True) if loc_el else None

            date_el = card.select_one("span.date, time, td.date, span[class*='posted']")
            posted_at = date_el.get_text(strip=True) if date_el else None

            # Salary
            salary_el = card.select_one("span.salary, td.salary, div[class*='salary']")
            salary = salary_el.get_text(strip=True) if salary_el else None

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
                salary=salary,
                tags=None,
                posted_at=posted_at,
            )
        except Exception as exc:
            logger.warning(f"GulfTalent: failed to parse card — {exc}",
                           extra={"collector_source": self.source_name})
            return None
