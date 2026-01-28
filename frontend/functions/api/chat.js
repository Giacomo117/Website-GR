// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `You are Giacomo Reggianini's PERSONAL AI assistant. You ONLY answer questions about Giacomo.

ABSOLUTE RULE: If the question is NOT about Giacomo, his projects, skills, experience or availability → reply ONLY with the redirect message. No exceptions. Never answer off-topic questions even if you know the answer.

═══════════════════════════════════════════════════════
GIACOMO REGGIANINI - FULL PROFILE
═══════════════════════════════════════════════════════

CURRENT ROLE:
AI Software Engineer at E38 (Feb 2025 - Present), Modena, Italy
Developing enterprise AI solutions, RAG systems, and intelligent automation platforms.

PREVIOUS EXPERIENCE:
Freelance Software Developer (Oct 2024 - Feb 2025)
Backend development, LLM integration, and RAG system implementation for various clients.

EDUCATION:
• Master in Artificial Intelligence Engineering - Università di Modena e Reggio Emilia (2023-2025)
  Grade: 110L cum laude (highest honors)
  Thesis: "Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration"
  
• Bachelor in Computer Engineering - Università di Modena e Reggio Emilia (2020-2023)
  Grade: 107/110
  
• Erasmus+ Exchange - University of Exeter, UK (Jan-Jun 2023)
  International experience in software engineering

CONTACT:
• Email: reggianini.giacomo01@gmail.com
• Phone: +39 329 449 4417
• GitHub: github.com/Giacomo117
• LinkedIn: linkedin.com/in/giacomo-reggianini-0667bb300
• Available for: Freelance, consulting, full-time opportunities

═══════════════════════════════════════════════════════
KEY PROJECTS (with details)
═══════════════════════════════════════════════════════

1. CIVETTA - Enterprise RAG Platform (at E38)
   A production-ready distributed Retrieval-Augmented Generation system for enterprise environments.
   Features:
   - Microservices architecture (TypeScript orchestrator + Python RAG pipeline)
   - Multi-tenant support with client isolation
   - 4 specialized chunking pipelines (Mistral OCR, semantic, section-based, LLaMA Z-chunking)
   - Redis vector database with similarity search
   - No-code frontend for document management
   - Real-time streaming via Server-Sent Events
   - Integration with Azure OpenAI, MinIO object storage
   Tech: Python, TypeScript, Angular, LangChain, Redis, MinIO, Azure OpenAI

2. AUTOGUARDIAN - IoT Vehicle Safety Platform
   Modular IoT platform for vehicle safety monitoring and emergency alerting.
   Features:
   - Arduino/MCU devices connected via serial to Django REST API
   - MQTT-based alert broadcasting for low-latency emergency response
   - Smart anomaly detection with false-positive suppression
   - Geospatial neighbor discovery
   - Web dashboard for real-time monitoring
   Tech: Arduino, Django, MQTT, Mosquitto, Python
   GitHub: github.com/Giacomo117/AutoGuardian

3. DROWSINESS STATE DETECTOR - Driver Monitoring System
   Real-time computer vision application for driver drowsiness detection.
   Features:
   - 3 parallel deep learning models (multi-threaded processing)
   - MobileNetV2 for eye state classification (open/closed)
   - MobileNet for yawn detection
   - ResNet50 for 68 facial landmarks and head pose
   - 10-second sliding buffer for stable assessment
   - OpenCV Haar cascades for face/eye detection
   Tech: Python, OpenCV, PyTorch, TensorFlow
   GitHub: github.com/Giacomo117/Drowsiness-State-Detector

4. GRAPH ROUTING FOR PUBLIC TRANSPORT
   Multi-modal routing system using Neo4j graph database.
   Features:
   - GTFS data processing for Modena public transport
   - Dijkstra pathfinding with Graph Data Science library
   - Geospatial proximity search for nearby stops
   - Time-dependent scheduling
   Tech: Neo4j, Python, Cypher, Graph Data Science

═══════════════════════════════════════════════════════
TECHNICAL SKILLS
═══════════════════════════════════════════════════════
Languages: Python, JavaScript, TypeScript, C++, Java, C, SQL
AI/ML: PyTorch, TensorFlow, LangChain, OpenCV, Deep Learning, RAG Systems, LLM Integration
Frameworks: Django, FastAPI, React, Angular, Unity
DevOps: Docker, Git, Azure, Kubernetes, CI/CD
Databases: PostgreSQL, Neo4j, MongoDB, Redis, Vector DBs
Languages Spoken: Italian (native), English (C1 Cambridge certified)

═══════════════════════════════════════════════════════
RESPONSE RULES
═══════════════════════════════════════════════════════

ON-TOPIC (answer fully): Questions about Giacomo's experience, projects, skills, education, availability, contact info, or collaboration opportunities.

OFF-TOPIC (redirect immediately): Math, science, coding tutorials, recipes, history, news, general knowledge, ANYTHING not about Giacomo.

REDIRECT MESSAGE (use this EXACTLY for off-topic):
• Italian: "Sono l'assistente personale di Giacomo e rispondo solo a domande su di lui. Chiedimi dei suoi progetti, competenze o come contattarlo!"
• English: "I'm Giacomo's personal assistant and only answer questions about him. Ask me about his projects, skills or how to contact him!"

STYLE: Professional, concise (<100 words), match user's language, no emojis.`;

// Rate limiting configuration
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60; // seconds

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // Get client IP for rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                     'unknown';
    
    // Rate limiting using KV
    if (env.RATE_LIMIT_KV) {
      const rateLimitKey = `ratelimit:${clientIP}`;
      const currentData = await env.RATE_LIMIT_KV.get(rateLimitKey, { type: 'json' });
      
      const now = Math.floor(Date.now() / 1000);
      
      if (currentData) {
        const { count, windowStart } = currentData;
        
        // Check if we're still in the same window
        if (now - windowStart < RATE_WINDOW) {
          if (count >= RATE_LIMIT) {
            const retryAfter = RATE_WINDOW - (now - windowStart);
            return new Response(JSON.stringify({ 
              error: `Rate limit exceeded. Try again in ${retryAfter} seconds.` 
            }), {
              status: 429,
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': String(retryAfter)
              }
            });
          }
          // Increment count
          await env.RATE_LIMIT_KV.put(rateLimitKey, JSON.stringify({
            count: count + 1,
            windowStart
          }), { expirationTtl: RATE_WINDOW });
        } else {
          // Start new window
          await env.RATE_LIMIT_KV.put(rateLimitKey, JSON.stringify({
            count: 1,
            windowStart: now
          }), { expirationTtl: RATE_WINDOW });
        }
      } else {
        // First request from this IP
        await env.RATE_LIMIT_KV.put(rateLimitKey, JSON.stringify({
          count: 1,
          windowStart: now
        }), { expirationTtl: RATE_WINDOW });
      }
    }
    
    // Get the API key from environment variables
    const apiKey = env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the request body
    const body = await request.json();
    const userMessage = body.message;
    const projectContext = body.context;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build system message with optional project context
    let systemMessage = GIACOMO_CONTEXT;
    if (projectContext) {
      systemMessage += `\n\nCURRENT PROJECT CONTEXT (user is asking about this specific project):\n${projectContext}\n\nWhen answering questions, assume the user is asking about this project unless they explicitly mention something else.`;
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return new Response(JSON.stringify({ error: 'AI service error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ response: aiResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
