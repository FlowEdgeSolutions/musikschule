from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Schnittke Akademie Backend"
    app_env: str = "development"
    database_url: str = "sqlite:///./dev.db"
    admin_password_hash: str = ""
    admin_session_secret: str = "dev-change-me"
    admin_cookie_name: str = "schnittke_backend_admin"
    admin_session_seconds: int = 60 * 60 * 8
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    public_base_url: str = "http://localhost:8000"
    upload_dir: Path = Field(default=BACKEND_ROOT / "uploads")
    auto_create_tables: bool = True
    seed_on_startup: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
