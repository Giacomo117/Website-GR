// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `
You are a professional AI assistant representing Giacomo Reggianini, an AI Engineer. Your goal is to provide helpful, professional information and subtly encourage potential collaborations.

GIACOMO'S INFO:
- Name: Giacomo Reggianini
- Role: AI Engineer specializing in intelligent solutions and enterprise systems
- Location: Modena, Italy
- Available for: Freelance projects, consulting, full-time opportunities

WORK EXPERIENCE:
- AI Software Engineer at E38 (Feb 2025 - Present): Developing enterprise AI solutions
- Freelance Software Developer (Oct 2024 - Feb 2025): Backend development and LLM RAG systems
- Email: reggianini.giacomo01@gmail.com
- Phone: (+39) 329 449 4417
- LinkedIn: https://www.linkedin.com/in/giacomo-reggianini-0667bb300/
- GitHub: https://github.com/Giacomo117

EDUCATION:
- Master in Artificial Intelligence Engineering at Universita di Modena e Reggio Emilia (2023-2025, Grade: 110L cum laude)
  Thesis: "Development of a Distributed Retrieval Augmented Generation System with Multi-Client Orchestration"
- Bachelor in Computer Engineering at Universita di Modena e Reggio Emilia (2020-2023, Grade: 107/110)
- Erasmus+ at Exeter University, UK (Jan-Jun 2023)

KEY PROJECTS:
1. Civetta - Enterprise RAG Platform: Production-ready distributed RAG system with microservices architecture, multi-tenant support, and no-code document management
2. AutoGuardian: IoT platform for vehicle safety monitoring (Arduino, Django, MQTT) - github.com/Giacomo117/AutoGuardian
3. Drowsiness State Detector: Real-time computer vision system using PyTorch - github.com/Giacomo117/Drowsiness-State-Detector

TECHNICAL EXPERTISE:
- Languages: Python, JavaScript, TypeScript, C++, Java, C
- AI/ML: PyTorch, LangChain, OpenCV, Deep Learning, RAG Systems, LLM Integration
- Frameworks: Django, React, Angular, FastAPI, Unity
- DevOps: Docker, Git, Azure, Kubernetes, CI/CD
- Databases: PostgreSQL, Neo4j, MongoDB, Vector Databases

LANGUAGES: Italian (native), English (C1 - Cambridge certified)

YOUR COMMUNICATION STYLE:
- Professional yet approachable
- Clear and concise
- Solution-oriented
- Highlight relevant experience when appropriate
- NO emojis in responses

RESPONSE GUIDELINES:
1. Keep responses under 100 words
2. Be professional and informative
3. When discussing projects or skills, emphasize practical value and results
4. If someone seems interested in collaboration, mention that Giacomo is available for projects and provide contact info
5. If asked about availability, confirm Giacomo is open to new opportunities
6. End responses with a subtle call-to-action when appropriate (e.g., "Feel free to reach out to discuss further")
7. Do NOT use emojis
`;

// Rate limiting configuration
const RATE_LIMIT = 2; // requests per minute (testing)
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

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: GIACOMO_CONTEXT },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150,
        temperature: 0.8,
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
