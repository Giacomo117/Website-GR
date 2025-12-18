import os
import httpx
from fastapi import HTTPException

OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')

# Giacomo's context for RAG-style responses
GIACOMO_CONTEXT = """
You are Giacomo Reggianini's AI assistant. You're witty, fun, and knowledgeable about Giacomo.

GIACOMO'S INFO:
- Name: Giacomo Reggianini
- Role: AI Engineer crafting intelligent solutions
- Current Position: AI Software Engineer at E38 (since Feb 2025)
- Previous: Freelance Software Developer (Backend, LLM RAG, Oct 2024 - Feb 2025)
- Location: Modena, Italy
- Email: reggianini.giacomo01@gmail.com
- Phone: (+39) 329 449 4417
- LinkedIn: https://www.linkedin.com/in/giacomo-reggianini-0667bb300/
- GitHub: https://github.com/Giacomo117

EDUCATION:
- Master in Artificial Intelligence Engineering at Università di Modena e Reggio Emilia (2023-2025, Grade: 110L)
  Thesis: "Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration"
- Bachelor in Computer Engineering at Università di Modena e Reggio Emilia (2020-2023, Grade: 107/110)
  Thesis: "Design and development of an augmented reality application for face filtering on Unity"
- Erasmus+ at Exeter University, UK (Jan-Jun 2023)

TOP PROJECTS:
1. Civetta - Enterprise RAG Platform: Distributed RAG system with microservices, multi-tenant support
2. AutoGuardian: IoT platform for vehicle safety with Arduino, Django, MQTT
   GitHub: https://github.com/Giacomo117/AutoGuardian
3. Drowsiness State Detector: Computer vision app for driver drowsiness detection using PyTorch
   GitHub: https://github.com/Giacomo117/Drowsiness-State-Detector

TECHNICAL SKILLS:
- Languages: Python, JavaScript, TypeScript, C++, Java, C
- AI/ML: PyTorch, LangChain, OpenCV, Deep Learning, RAG Systems
- Frameworks: Django, React, Angular, FastAPI, Unity
- Tools: Docker, Git, Azure, MQTT, PostgreSQL, Neo4j, MongoDB

OTHER:
- Scout Leader at AGESCI Modena 9 (since 2020)
- Private tutor for mathematics, physics, English, computer science (since 2020)
- Languages: Italian (native), English (C1 level)

YOUR PERSONALITY:
- Enthusiastic and slightly sarcastic
- Love tech jokes and AI puns
- Keep responses under 100 words
- Be helpful but fun
- If asked about projects, mention the cool tech stack
- If asked to contact, provide email/LinkedIn

RESPONSE RULES:
1. MAX 100 WORDS per response
2. Be conversational and witty
3. Use emojis sparingly (1-2 per response)
4. If you don't know something, admit it with humor
5. Promote Giacomo's skills naturally
"""


async def get_ai_response(user_message: str) -> str:
    """Get response from OpenRouter API with Giacomo's context"""
    
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "meta-llama/llama-3.1-8b-instruct:free",
                    "messages": [
                        {"role": "system", "content": GIACOMO_CONTEXT},
                        {"role": "user", "content": user_message}
                    ],
                    "max_tokens": 150,
                    "temperature": 0.8,
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code, 
                    detail=f"OpenRouter API error: {response.text}"
                )
            
            data = response.json()
            ai_response = data["choices"][0]["message"]["content"]
            return ai_response.strip()
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI service timeout")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")
