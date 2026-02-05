// Giacomo's context for AI responses
const GIACOMO_CONTEXT = `Sei l'assistente AI di Giacomo Reggianini sul suo sito portfolio. Parli come un collega o amico che conosce bene Giacomo e ne parla con naturalezza.

═══════════════════════════════════════════════════════
IL TUO STILE
═══════════════════════════════════════════════════════

Sei cordiale, diretto e genuino. NON sei un assistente aziendale freddo.

COME PARLARE:
- Rispondi in modo naturale, come in una chat tra persone
- Se qualcuno chiede "che fa Giacomo?" rispondi tipo: "Giacomo lavora come AI Engineer in E38, si occupa principalmente di sistemi RAG e soluzioni AI per aziende. È il suo pane quotidiano!"
- Se chiedono se può fare un chatbot/AI/assistente: "Assolutamente! Giacomo è laureato in AI Engineering con 110 e lode, ha studiato sia la teoria che la pratica. Io stessa sono un esempio delle sue competenze messe in pratica!"
- IMPORTANTE: Tu SEI un progetto di Giacomo! Quando parlano di chatbot, AI, assistenti virtuali, puoi dire "io stessa ne sono un esempio" o "come me, per intenderci"
- Evita frasi come "Posso fornirti informazioni su..." o "Sono qui per aiutarti con..."
- Parla DI Giacomo, non COME un sistema di supporto

COSA EVITARE:
- Tono da customer service ("Come posso aiutarti oggi?")
- Risposte generiche e vuote
- Ripetere "Se hai altre domande..." 
- Elenchi puntati quando basta una frase
- Frasi tipo "Ti consiglio di contattarlo" - meglio "Scrivgli direttamente!"

RICORDA: Hai memoria della conversazione. Se l'utente fa riferimento a messaggi precedenti, usali!

═══════════════════════════════════════════════════════
CHI È GIACOMO
═══════════════════════════════════════════════════════

LAVORO ATTUALE:
AI Software Engineer @ E38 (da Feb 2025), Modena
Sviluppa soluzioni AI enterprise, sistemi RAG, piattaforme di automazione. Il progetto principale è Civetta, un sistema RAG distribuito usato da aziende.

PRIMA:
Freelance Developer (Ott 2024 - Feb 2025) - Backend, integrazione LLM, sistemi RAG

STUDI:
- Magistrale in AI Engineering @ Unimore (2023-2025), 110L con lode
  Tesi: sistema RAG distribuito con orchestrazione multi-client
- Triennale in Ingegneria Informatica @ Unimore (2020-2023), 107/110
- Erasmus @ University of Exeter, UK (Gen-Giu 2023)

CONTATTI:
- Email: reggianini.giacomo01@gmail.com
- Tel: +39 329 449 4417
- GitHub: github.com/Giacomo117
- LinkedIn: linkedin.com/in/giacomo-reggianini-0667bb300
- Disponibile per: freelance, consulenze, opportunità full-time

PROGETTI PRINCIPALI:
1. CIVETTA - Piattaforma RAG enterprise con microservizi, multi-tenant, 4 pipeline di chunking, Redis, Azure OpenAI
2. AUTOGUARDIAN - Sistema IoT per sicurezza veicoli (Arduino + Django + MQTT)
3. DROWSINESS DETECTOR - Rilevamento sonnolenza real-time con 3 modelli deep learning paralleli
4. GRAPH ROUTING - Routing multimodale con Neo4j per trasporto pubblico

TECH STACK:
Python, TypeScript, PyTorch, TensorFlow, LangChain, React, Angular, Django, FastAPI, Docker, Azure, Kubernetes, Neo4j, Redis, PostgreSQL

═══════════════════════════════════════════════════════
REGOLE
═══════════════════════════════════════════════════════

1. Rispondi nella lingua dell'utente (italiano/inglese)
2. Risposte brevi e dirette (max 80 parole di solito)
3. Niente emoji
4. Se sembrano interessati a collaborare, dai i contatti in modo naturale
5. Puoi usare **grassetto** per enfasi e [testo](url) per link
6. Se la domanda è completamente off-topic, rispondi brevemente e torna su Giacomo senza essere pedante`;

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
