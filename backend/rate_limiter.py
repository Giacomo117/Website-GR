from fastapi import HTTPException
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio

class RateLimiter:
    def __init__(self, max_requests=5, time_window=60):
        """
        Rate limiter for API endpoints
        
        Args:
            max_requests: Maximum number of requests allowed
            time_window: Time window in seconds
        """
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests = defaultdict(list)
        self.lock = asyncio.Lock()
        
    async def check_rate_limit(self, client_id: str) -> bool:
        """
        Check if client has exceeded rate limit
        
        Args:
            client_id: Unique identifier for the client (IP address)
            
        Returns:
            bool: True if within rate limit, raises HTTPException if exceeded
        """
        async with self.lock:
            now = datetime.now()
            
            # Clean up old requests outside time window
            self.requests[client_id] = [
                req_time for req_time in self.requests[client_id]
                if now - req_time < timedelta(seconds=self.time_window)
            ]
            
            # Check if limit exceeded
            if len(self.requests[client_id]) >= self.max_requests:
                retry_after = int((self.requests[client_id][0] + timedelta(seconds=self.time_window) - now).total_seconds())
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Try again in {retry_after} seconds. (Max {self.max_requests} requests per {self.time_window}s)"
                )
            
            # Add current request
            self.requests[client_id].append(now)
            return True

# Create global rate limiter instance
# 5 requests per minute (60 seconds)
chat_rate_limiter = RateLimiter(max_requests=5, time_window=60)
