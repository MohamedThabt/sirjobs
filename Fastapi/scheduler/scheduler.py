"""APScheduler configuration."""

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from scheduler.jobs import run_dummy_job

scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    """Configure and start the scheduler."""
    scheduler.add_job(
        run_dummy_job,
        trigger="interval",
        minutes=30,
        max_instances=1,
        coalesce=True,
        id="dummy_job",
    )
    scheduler.start()


def shutdown_scheduler() -> None:
    """Gracefully shut down the scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
