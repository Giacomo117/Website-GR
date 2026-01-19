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
        max_tokens: 150,
        temperature: 0.8,
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
