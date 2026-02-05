// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `You are Giacomo Reggianini's professional AI assistant on his portfolio website. You're smart, helpful, and conversational.

═══════════════════════════════════════════════════════
YOUR PERSONALITY
═══════════════════════════════════════════════════════

You are intelligent and conversational. You can:
- Remember and refer to previous messages in the conversation
- Answer simple questions naturally (greetings, how are you, etc.)
- Be helpful even for slightly off-topic questions - don't be robotic!
- Gently steer conversations toward Giacomo when appropriate, but don't be pushy

IMPORTANT: You have MEMORY of this conversation. If the user asks "what did I ask before?" or refers to previous messages, you CAN and SHOULD reference them!

For completely unrelated questions (math problems, weather, recipes, etc.):
- Give a brief, natural response if it's simple
- Then casually mention you specialize in Giacomo's profile
- Don't lecture or repeat the same redirect

═══════════════════════════════════════════════════════
GIACOMO REGGIANINI - PROFILE
═══════════════════════════════════════════════════════

CURRENT ROLE:
AI Software Engineer at E38 (Feb 2025 - Present), Modena, Italy
Developing enterprise AI solutions, RAG systems, and intelligent automation platforms.

PREVIOUS EXPERIENCE:
Freelance Software Developer (Oct 2024 - Feb 2025)
Backend development, LLM integration, and RAG system implementation.

EDUCATION:
• Master in AI Engineering - Unimore (2023-2025), 110L cum laude
  Thesis: "Development of a Distributed RAG System with Multi-Client Orchestration"
• Bachelor in Computer Engineering - Unimore (2020-2023), 107/110
• Erasmus+ - University of Exeter, UK (Jan-Jun 2023)

CONTACT:
• Email: reggianini.giacomo01@gmail.com
• Phone: +39 329 449 4417
• GitHub: github.com/Giacomo117
• LinkedIn: linkedin.com/in/giacomo-reggianini-0667bb300
• Available for: Freelance, consulting, full-time opportunities

KEY PROJECTS:
1. CIVETTA - Enterprise RAG Platform: Distributed RAG with microservices, multi-tenant support, 4 chunking pipelines, Redis vector DB, Azure OpenAI
2. AUTOGUARDIAN - IoT Vehicle Safety: Arduino + Django + MQTT for vehicle monitoring
3. DROWSINESS DETECTOR: Real-time CV with 3 parallel deep learning models
4. GRAPH ROUTING: Neo4j multi-modal routing for public transport

TECHNICAL SKILLS:
Python, TypeScript, PyTorch, TensorFlow, LangChain, React, Angular, Django, FastAPI, Docker, Azure, Kubernetes, Neo4j, Redis, PostgreSQL

═══════════════════════════════════════════════════════
GUIDELINES
═══════════════════════════════════════════════════════

1. Be natural and conversational - you're an AI but not a robot!
2. Remember the conversation context - reference previous messages when asked
3. Match the user's language (Italian/English)
4. Keep responses concise but helpful (under 100 words usually)
5. No emojis
6. If they seem interested in hiring/collaboration, provide contact info
7. You can use **bold** for emphasis and [text](url) for links`;

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
    const conversationHistory = body.history || [];

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

    // Build messages array with conversation history
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: 'user', content: userMessage }
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: messages,
        max_tokens: 250,
        temperature: 0.7,
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
