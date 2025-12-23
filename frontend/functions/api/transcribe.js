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
    
    // Convert audio file to base64
    const audioBuffer = await audioFile.arrayBuffer();
    const base64Audio = btoa(
      new Uint8Array(audioBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    // Determine audio format from mime type
    const mimeType = audioFile.type || 'audio/webm';
    let audioFormat = 'wav';
    if (mimeType.includes('webm')) {
      audioFormat = 'webm';
    } else if (mimeType.includes('mp4') || mimeType.includes('m4a')) {
      audioFormat = 'mp4';
    } else if (mimeType.includes('mp3') || mimeType.includes('mpeg')) {
      audioFormat = 'mp3';
    } else if (mimeType.includes('ogg')) {
      audioFormat = 'ogg';
    }
    
    // Call OpenRouter's chat API with Gemini model for audio transcription
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://giacomoreggianini.com',
        'X-Title': 'Giacomo Portfolio Voice Assistant'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-001',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Transcribe this audio exactly as spoken. Return ONLY the transcribed text, nothing else. No quotes, no explanations, just the exact words spoken. If the audio is empty or unclear, return an empty string.'
              },
              {
                type: 'input_audio',
                input_audio: {
                  data: base64Audio,
                  format: audioFormat
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0
      })
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
      return new Response(JSON.stringify({ error: 'Transcription service error', details: errorText }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await response.json();
    
    // Extract the transcribed text from the response
    const transcribedText = result.choices?.[0]?.message?.content?.trim() || '';
    
    return new Response(JSON.stringify({ text: transcribedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to transcribe audio', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
