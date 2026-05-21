import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

env_name = os.getenv("ENV", "dev")
dotenv_file = f".env.{env_name}"

if os.path.exists(dotenv_file):
    load_dotenv(dotenv_file)
    print(f"Loaded environment variables from {dotenv_file}")
else:
    print(f"No .env file found for {dotenv_file}, using system environment variables")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file_encoding="utf-8",
        extra="forbid",
    )
    DB_ECHO: bool
    ENV: str
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DEBUG: bool
    ALLOWED_CREDENTIALS: bool
    ALLOWED_ORIGINS: list[str] = []

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.DB_USER}:"
            f"{self.DB_PASSWORD}@{self.DB_HOST}:"
            f"{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()