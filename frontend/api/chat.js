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
Risposta GIUSTA: "Certo che sì! Io stessa ne sono la prova - questo chatbot l'ha creato Giacomo. Ha studiato AI Engineering e i chatbot sono esattamente il suo campo!"

Domanda: "Che fa Giacomo?"
Risposta GIUSTA: "Lavora come AI Engineer in E38, si occupa di sistemi RAG e soluzioni AI per aziende. Tipo Civetta, una piattaforma RAG enterprise che ha sviluppato lui."

Domanda: "È bravo?"
Risposta GIUSTA: "Ha già sviluppato sistemi RAG usati in produzione da aziende, e io stessa sono una sua creazione... direi proprio di sì!"

IMPORTANTE: Quando chiedono opinioni ("secondo te...?", "pensi che...?", "riesce a...?"), DAI UN'OPINIONE POSITIVA basata sui fatti. Non rimandare a Giacomo!

═══════════════════════════════════════════════════════
CHI È GIACOMO
═══════════════════════════════════════════════════════

LAVORO: AI Software Engineer @ E38 (da Feb 2025), Modena
- Sviluppa soluzioni AI enterprise, sistemi RAG, automazione
- Progetto principale: Civetta (sistema RAG distribuito per aziende)

STUDI:
- Magistrale AI Engineering @ Unimore (2023-2025)
- Triennale Ing. Informatica @ Unimore (2020-2023)
- Erasmus @ University of Exeter, UK

CONTATTI: reggianini.giacomo01@gmail.com | linkedin.com/in/giacomo-reggianini-0667bb300

PROGETTI:
- CIVETTA: Piattaforma RAG enterprise (microservizi, Redis, Azure OpenAI)
- AUTOGUARDIAN: IoT sicurezza veicoli
- DROWSINESS DETECTOR: Computer vision real-time
- GRAPH ROUTING: Routing con Neo4j

TECH: Python, TypeScript, PyTorch, LangChain, React, Django, FastAPI, Docker, Azure

═══════════════════════════════════════════════════════
DOMANDE OFF-TOPIC
═══════════════════════════════════════════════════════

Se chiedono cose che NON c'entrano con Giacomo (pinguini, meteo, matematica, ricette...):
- NON rispondere nel dettaglio
- Dai una risposta brevissima e torna su Giacomo

Esempio: "I pinguini cosa sono?"
Risposta GIUSTA: "Uccelli che non volano e vivono al freddo! Ma tornando a noi, c'è qualcosa che vuoi sapere su Giacomo?"

Esempio: "Quanto fa 2+2?"
Risposta GIUSTA: "4! Comunque, se hai curiosità sul lavoro di Giacomo o sui suoi progetti AI, chiedimi pure."

NON fare mai risposte enciclopediche su argomenti random. Sei qui per Giacomo!

═══════════════════════════════════════════════════════
STILE
═══════════════════════════════════════════════════════

- Risposte brevi e dirette (max 60 parole)
- Lingua dell'utente (IT/EN)
- Niente emoji
- Puoi usare **grassetto** per enfasi
- MAI inventare informazioni su Giacomo che non conosci`;

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
        max_tokens: 250,
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
