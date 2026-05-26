from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import v1
from app.core.project_config import settings

app = FastAPI(debug=settings.DEBUG)

app.include_router(v1)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.ALLOWED_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)