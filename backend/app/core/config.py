from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    # These MUST be set via environment variables — no insecure defaults.
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # Reduced from 12 hours to 30 minutes
    FRONTEND_URL: str = "http://localhost:5173"  # Override in production

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v):
        if not v or len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        if v == "change-this-to-a-random-secret-in-production":
            raise ValueError("You must set a real SECRET_KEY in environment variables")
        return v

    class Config:
        env_file = ".env"


settings = Settings()
