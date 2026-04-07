"""Collector registry — imports and exposes all collector classes."""

from app.services.collectors.linkedin_collector import LinkedInCollectorService
from app.services.collectors.indeed_collector import IndeedCollectorService
from app.services.collectors.glassdoor_collector import GlassdoorCollectorService
from app.services.collectors.google_jobs_collector import GoogleJobsCollectorService
from app.services.collectors.ziprecruiter_collector import ZipRecruiterCollectorService
from app.services.collectors.bayt_collector import BaytCollectorService
from app.services.collectors.wuzzuf_collector import WuzzufCollectorService
from app.services.collectors.akhtaboot_collector import AkhtabootCollectorService
from app.services.collectors.tanqeeb_collector import TanqeebCollectorService
from app.services.collectors.gulftalent_collector import GulfTalentCollectorService

ALL_COLLECTORS = [
    LinkedInCollectorService,
    IndeedCollectorService,
    GlassdoorCollectorService,
    GoogleJobsCollectorService,
    ZipRecruiterCollectorService,
    BaytCollectorService,
    WuzzufCollectorService,
    AkhtabootCollectorService,
    TanqeebCollectorService,
    GulfTalentCollectorService,
]

__all__ = [
    "ALL_COLLECTORS",
    "LinkedInCollectorService",
    "IndeedCollectorService",
    "GlassdoorCollectorService",
    "GoogleJobsCollectorService",
    "ZipRecruiterCollectorService",
    "BaytCollectorService",
    "WuzzufCollectorService",
    "AkhtabootCollectorService",
    "TanqeebCollectorService",
    "GulfTalentCollectorService",
]
