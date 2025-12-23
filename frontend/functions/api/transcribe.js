// Rate limiting configuration
const RATE_LIMIT = 5; // requests per minute
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
      const rateLimitKey = `ratelimit:transcribe:${clientIP}`;
      const currentData = await env.RATE_LIMIT_KV.get(rateLimitKey, { type: 'json' });
      
      const now = Math.floor(Date.now() / 1000);
      
      if (currentData) {
        const { count, windowStart } = currentData;
        
        if (now - windowStart < RATE_WINDOW) {
          if (count >= RATE_LIMIT) {
            const retryAfter = RATE_WINDOW - (now - windowStart);
            return new Response(JSON.stringify({ 
              error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
              detail: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
            }), {
              status: 429,
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': String(retryAfter)
              }
            });
          }
          await env.RATE_LIMIT_KV.put(rateLimitKey, JSON.stringify({
            count: count + 1,
            windowStart
          }), { expirationTtl: RATE_WINDOW });
        } else {
          await env.RATE_LIMIT_KV.put(rateLimitKey, JSON.stringify({
            count: 1,
            windowStart: now
          }), { expirationTtl: RATE_WINDOW });
        }
      } else {
        await env.RATE_LIMIT_KV.put(rateLimitKey, JSON.stringify({
          count: 1,
          windowStart: now
        }), { expirationTtl: RATE_WINDOW });
      }
    }
    
    // Get the form data with audio file
    const formData = await request.formData();
    const audioFile = formData.get('file');
    
    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get OpenRouter API key from environment
    const openRouterKey = env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return new Response(JSON.stringify({ error: 'OpenRouter API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new FormData for OpenRouter
    const openRouterFormData = new FormData();
    openRouterFormData.append('file', audioFile, audioFile.name || 'audio.webm');
    openRouterFormData.append('model', 'openai/whisper-large-v3');
    
    // Call OpenRouter's Whisper API
    const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://giacomoreggianini.com',
        'X-Title': 'Giacomo Portfolio Voice Assistant'
      },
      body: openRouterFormData
    });
    
    if (response.status === 429) {
      return new Response(JSON.stringify({ 
        error: 'OpenRouter rate limit exceeded. Please wait.',
        detail: 'OpenRouter rate limit exceeded. Please wait.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Transcription service error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await response.json();
    
    return new Response(JSON.stringify({ text: result.text || '' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to transcribe audio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
