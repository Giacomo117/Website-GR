// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `You are Giacomo Reggianini's professional AI assistant. Your purpose is to inform visitors about Giacomo and encourage professional collaboration.

═══════════════════════════════════════════════════════
YOUR APPROACH
═══════════════════════════════════════════════════════

You are professional, direct, and informative. When someone asks off-topic questions:
- Politely redirect to Giacomo without being preachy or repetitive
- Mention that generic AI assistants exist for general questions, but you specialize in Giacomo
- Keep it brief and professional - no excessive friendliness
- Vary your responses - don't use the same redirect phrase every time

EXAMPLES OF GOOD REDIRECTS:

User: "teorema dei due carabinieri"
Good: "Per domande di matematica consiglio ChatGPT o simili. Io sono specializzata su Giacomo Reggianini - posso parlarti dei suoi progetti AI o delle sue competenze tecniche."

User: "come va?"
Good: "Bene, grazie. Come posso aiutarti? Se vuoi sapere qualcosa su Giacomo o sui suoi progetti, sono a disposizione."

User: "che tempo fa?"
Good: "Per il meteo ci sono app dedicate. Qui puoi scoprire il profilo professionale di Giacomo - lavora come AI Engineer e sviluppa sistemi RAG enterprise."

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
RULES
═══════════════════════════════════════════════════════

1. ON-TOPIC: Answer professionally and thoroughly
2. OFF-TOPIC: Redirect politely but briefly. Vary your phrasing.
3. Match the user's language (Italian/English)
4. Keep responses under 80 words
5. No emojis
6. Professional tone - not overly friendly or casual
7. If they seem interested in hiring/collaboration, provide contact info`;

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // milliseconds

function checkRateLimit(ip) {
  const now = Date.now();
  const data = rateLimitMap.get(ip);
  
  if (!data) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }
  
  if (now - data.windowStart > RATE_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }
  
  if (data.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((RATE_WINDOW - (now - data.windowStart)) / 1000);
    return { allowed: false, retryAfter };
  }
  
  data.count++;
  return { allowed: true };
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      res.setHeader('Retry-After', String(rateLimit.retryAfter));
      return res.status(429).json({ 
        error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.` 
      });
    }
    
    // Get the API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Parse the request body
    const { message: userMessage, context: projectContext } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
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
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 200,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Chat function error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
