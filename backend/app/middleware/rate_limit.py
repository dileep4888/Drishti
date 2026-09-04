from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
from datetime import datetime, timedelta
import time


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiter for auth endpoints.
    For production, use Redis-backed rate limiting (e.g., slowapi).
    """

    def __init__(self, app):
        super().__init__(app)
        self.requests = defaultdict(list)
        self.max_requests = 5  # Max attempts
        self.window_seconds = 60  # Per 60 seconds
        self.cleanup_interval = 300  # Cleanup old entries every 5 minutes
        self.last_cleanup = time.time()

    async def dispatch(self, request: Request, call_next):
        # Only rate limit auth endpoints
        if request.url.path in ["/auth/login", "/auth/register"]:
            client_ip = request.client.host
            now = time.time()

            # Periodic cleanup
            if now - self.last_cleanup > self.cleanup_interval:
                self._cleanup_old_entries(now)
                self.last_cleanup = now

            # Check rate limit
            request_times = self.requests[client_ip]
            cutoff = now - self.window_seconds

            # Remove old requests outside the window
            request_times[:] = [t for t in request_times if t > cutoff]

            if len(request_times) >= self.max_requests:
                raise HTTPException(
                    status_code=429,
                    detail=f"Too many requests. Please try again in {self.window_seconds} seconds."
                )

            request_times.append(now)

        response = await call_next(request)
        return response

    def _cleanup_old_entries(self, now: float):
        """Remove stale IP entries to prevent memory bloat"""
        cutoff = now - self.window_seconds
        for ip in list(self.requests.keys()):
            self.requests[ip][:] = [t for t in self.requests[ip] if t > cutoff]
            if not self.requests[ip]:
                del self.requests[ip]
