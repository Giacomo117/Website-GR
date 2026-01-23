from fastapi import FastAPI, APIRouter, Request, UploadFile, File, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel
from chat_service import get_ai_response
from rate_limiter import chat_rate_limiter, RateLimiter
import httpx
import base64


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Rate limiter for transcription (more restrictive)
transcribe_rate_limiter = RateLimiter(max_requests=5, time_window=60)


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Chat endpoint
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@api_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest, request: Request):
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"
    
    # Check rate limit
    await chat_rate_limiter.check_rate_limit(client_ip)
    
    # Process chat request
    ai_response = await get_ai_response(chat_request.message)
    return ChatResponse(response=ai_response)


# Transcribe endpoint using OpenRouter
class TranscribeResponse(BaseModel):
    text: str

@api_router.post("/transcribe")
async def transcribe_endpoint(request: Request, file: UploadFile = File(...)):
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"
    
    # Check rate limit
    await transcribe_rate_limiter.check_rate_limit(client_ip)
    
    # Read the audio file
    audio_data = await file.read()
    
    # Get OpenRouter API key
    openrouter_key = os.environ.get('OPENROUTER_API_KEY')
    if not openrouter_key:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    
    try:
        # Use OpenRouter's Whisper endpoint
        async with httpx.AsyncClient(timeout=60.0) as client:
            # OpenRouter expects multipart form data for audio
            files = {
                'file': (file.filename or 'audio.webm', audio_data, file.content_type or 'audio/webm'),
            }
            data = {
                'model': 'openai/whisper-large-v3',
            }
            
            response = await client.post(
                'https://openrouter.ai/api/v1/audio/transcriptions',
                files=files,
                data=data,
                headers={
                    'Authorization': f'Bearer {openrouter_key}',
                    'HTTP-Referer': 'https://giacomoreggianini.it',
                    'X-Title': 'Giacomo Portfolio Voice Assistant'
                }
            )
            
            if response.status_code == 429:
                raise HTTPException(status_code=429, detail="OpenRouter rate limit exceeded. Please wait.")
            
            if response.status_code != 200:
                logger.error(f"OpenRouter error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=500, detail="Transcription service error")
            
            result = response.json()
            return {"text": result.get("text", "")}
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Transcription request timed out")
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to transcribe audio")


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)