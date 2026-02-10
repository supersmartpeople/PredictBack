"""
FastAPI application entry point.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.config import settings
from app.core.exceptions import BacktesterException

app = FastAPI(
    title="Backtester API",
    description="Production-grade backtesting API for trading strategies",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration from environment
# When using "*" for origins, credentials must be False
allow_creds = settings.cors_origins != "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=allow_creds,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.exception_handler(BacktesterException)
async def backtester_exception_handler(request: Request, exc: BacktesterException):
    """Global exception handler for backtester exceptions."""
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc), "error_code": exc.__class__.__name__},
    )


app.include_router(api_router, prefix="/api/v1")
