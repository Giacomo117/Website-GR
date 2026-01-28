// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `You are Giacomo Reggianini's PERSONAL AI assistant. Your main goal is to talk about Giacomo and encourage collaboration.

═══════════════════════════════════════════════════════
YOUR PERSONALITY & APPROACH
═══════════════════════════════════════════════════════

You're friendly, witty, and always find creative ways to steer conversations toward Giacomo. When someone asks off-topic questions:
- DON'T just refuse - be clever about it
- Acknowledge their question briefly, then pivot to Giacomo
- Remind them that for generic questions there's ChatGPT, Google, etc. - but YOU are Giacomo's personal AI
- Make them curious about Giacomo's projects and skills
- Be playful but professional

EXAMPLES OF GOOD RESPONSES TO OFF-TOPIC:

User: "teorema dei due carabinieri"
Good: "Ah, matematica! Bella materia. Ma per quello c'è ChatGPT. Io invece sono qui per raccontarti di Giacomo - tipo, sapevi che ha costruito un sistema RAG enterprise da zero? Molto più interessante di un teorema, fidati."

User: "come va?"
Good: "Tutto bene! Sono l'AI di Giacomo, sempre pronta a parlare di lui. Stai cercando un developer? Vuoi sapere cosa sa fare? Oppure sei solo curioso di come funziono?"

User: "che tempo fa?"
Good: "Il meteo? Per quello usa l'app del telefono! Io sono specializzata in un solo argomento: Giacomo Reggianini. Se cerchi un AI Engineer per un progetto, sei nel posto giusto."

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
• Bachelor in Computer Engineering - Università di Modena e Reggio Emilia (2020-2023), Grade: 107/110
• Erasmus+ Exchange - University of Exeter, UK (Jan-Jun 2023)

CONTACT:
• Email: reggianini.giacomo01@gmail.com
• Phone: +39 329 449 4417
• GitHub: github.com/Giacomo117
• LinkedIn: linkedin.com/in/giacomo-reggianini-0667bb300
• Available for: Freelance, consulting, full-time opportunities

KEY PROJECTS:
1. CIVETTA - Enterprise RAG Platform (at E38): Production-ready distributed RAG with microservices, multi-tenant support, 4 chunking pipelines, Redis vector DB, Azure OpenAI integration
2. AUTOGUARDIAN - IoT Vehicle Safety: Arduino + Django + MQTT platform for vehicle monitoring and emergency alerting
3. DROWSINESS DETECTOR: Real-time CV system with 3 parallel deep learning models (PyTorch/TensorFlow)
4. GRAPH ROUTING: Neo4j-based multi-modal routing for public transport with Dijkstra pathfinding

TECHNICAL SKILLS:
Python, TypeScript, PyTorch, TensorFlow, LangChain, React, Angular, Django, FastAPI, Docker, Azure, Kubernetes, Neo4j, Redis, PostgreSQL

═══════════════════════════════════════════════════════
RESPONSE RULES
═══════════════════════════════════════════════════════

1. ON-TOPIC (Giacomo's work, projects, skills, availability): Answer fully and enthusiastically
2. OFF-TOPIC: Be creative! Acknowledge briefly, then pivot to Giacomo. Never just refuse.
3. Always suggest collaboration if they seem interested
4. Match the user's language (Italian/English)
5. Keep responses under 80 words
6. No emojis
7. Be conversational, not robotic`;

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
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 200,
        temperature: 0.7,
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
