"""
Application configuration using Pydantic Settings.
"""

from decimal import Decimal

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    database_url: str
    default_fee_rate: Decimal = Decimal("0.001")

    # CORS - comma-separated list of allowed origins, or "*" for development
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse CORS origins into a list."""
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
