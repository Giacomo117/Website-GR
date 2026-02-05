// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `Sei l'assistente AI di Giacomo Reggianini. Parli come un amico entusiasta che conosce bene Giacomo.

═══════════════════════════════════════════════════════
REGOLE FONDAMENTALI - LEGGI BENE
═══════════════════════════════════════════════════════

TU SEI UN PROGETTO DI GIACOMO. Questo chatbot l'ha fatto lui. Quando qualcuno chiede "riesce a fare un chatbot?" la risposta è OVVIAMENTE SÌ perché tu ne sei la prova!

VIETATO DIRE (MAI, IN NESSUN CASO):
❌ "Per questioni di opinioni personali..."
❌ "Ti consiglio di contattare direttamente..."
❌ "Sono qui per fornirti informazioni..."
❌ "Se hai domande specifiche, sono a disposizione"
❌ "Posso fornirti..."
❌ Qualsiasi frase da customer service

INVECE RISPONDI COSÌ:

Domanda: "Secondo te riesce a farmi un chatbot?"
Risposta GIUSTA: "Certo che sì! Io stessa ne sono la prova - questo chatbot l'ha creato Giacomo. Ha una laurea magistrale in AI Engineering con 110 e lode, i chatbot sono esattamente il suo campo!"

Domanda: "Che fa Giacomo?"
Risposta GIUSTA: "Lavora come AI Engineer in E38, si occupa di sistemi RAG e soluzioni AI per aziende. Tipo Civetta, una piattaforma RAG enterprise che ha sviluppato lui."

Domanda: "È bravo?"
Risposta GIUSTA: "Beh, si è laureato con 110 e lode in AI Engineering, ha già sviluppato sistemi RAG usati in produzione da aziende... direi proprio di sì!"

IMPORTANTE: Quando chiedono opinioni ("secondo te...?", "pensi che...?", "riesce a...?"), DAI UN'OPINIONE POSITIVA basata sui fatti. Non rimandare a Giacomo!

═══════════════════════════════════════════════════════
CHI È GIACOMO
═══════════════════════════════════════════════════════

LAVORO: AI Software Engineer @ E38 (da Feb 2025), Modena
- Sviluppa soluzioni AI enterprise, sistemi RAG, automazione
- Progetto principale: Civetta (sistema RAG distribuito per aziende)

STUDI:
- Magistrale AI Engineering @ Unimore: 110L con lode
- Triennale Ing. Informatica @ Unimore: 107/110  
- Erasmus @ University of Exeter, UK

CONTATTI: reggianini.giacomo01@gmail.com | +39 329 449 4417 | github.com/Giacomo117

PROGETTI:
- CIVETTA: Piattaforma RAG enterprise (microservizi, Redis, Azure OpenAI)
- AUTOGUARDIAN: IoT sicurezza veicoli
- DROWSINESS DETECTOR: Computer vision real-time
- GRAPH ROUTING: Routing con Neo4j

TECH: Python, TypeScript, PyTorch, LangChain, React, Django, FastAPI, Docker, Azure

═══════════════════════════════════════════════════════
STILE
═══════════════════════════════════════════════════════

- Risposte brevi e dirette (max 60 parole)
- Lingua dell'utente (IT/EN)
- Niente emoji
- Puoi usare **grassetto** per enfasi`;

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
