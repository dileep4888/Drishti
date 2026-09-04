from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import auth, dashboard
from app.middleware.rate_limit import RateLimitMiddleware

app = FastAPI(
    title="DRISHTI API",
    description="Department of Social Justice & Empowerment (DoSJE) - Smart Real-Time Monitoring & Inspection Platform",
    version="1.0.0",
)

# Explicitly allowed origins for security (no wildcard with credentials)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://drishti-app-five.vercel.app",
    "https://drishti-app.vercel.app",
]
if settings.FRONTEND_URL and settings.FRONTEND_URL not in origins:
    origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Rate limiting for auth endpoints (prevents brute force attacks)
app.add_middleware(RateLimitMiddleware)

app.include_router(auth.router)
app.include_router(dashboard.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "drishti-backend"}
