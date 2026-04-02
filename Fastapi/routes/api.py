"""API route definitions."""

from fastapi import APIRouter, Depends, Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db

router = APIRouter()

@router.get("/health")
async def health_check(request: Request, db: AsyncSession = Depends(get_db)):
    """Basic health check endpoint."""
    # Simple query to verify database connection
    await db.execute(text("SELECT 1"))
    return {"status": "healthy", "database": "connected"}
