import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

// Disable the default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // requests per minute
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

// Parse multipart form data
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB max
    });
    
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
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
        error: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.`,
        detail: `Rate limit exceeded. Try again in ${rateLimit.retryAfter} seconds.`
      });
    }
    
    // Get OpenRouter API key from environment
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    // Parse the form data
    const { files } = await parseForm(req);
    const audioFile = files.file?.[0] || files.file;
    
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Read the file and create form data for OpenRouter
    const fileBuffer = fs.readFileSync(audioFile.filepath);
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: audioFile.originalFilename || 'audio.webm',
      contentType: audioFile.mimetype || 'audio/webm',
    });
    formData.append('model', 'openai/whisper-1');
    formData.append('response_format', 'json');
    
    // Call OpenRouter's Whisper transcription endpoint
    const response = await fetch('https://openrouter.ai/api/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://giacomoreggianini.it',
        'X-Title': 'Giacomo Portfolio Voice Assistant',
        ...formData.getHeaders(),
      },
      body: formData,
    });

    // Clean up temp file
    try {
      fs.unlinkSync(audioFile.filepath);
    } catch (e) {
      // Ignore cleanup errors
    }

    if (response.status === 429) {
      return res.status(429).json({ 
        error: 'OpenRouter rate limit exceeded. Please wait.',
        detail: 'OpenRouter rate limit exceeded. Please wait.'
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Whisper error:', response.status, errorText);
      return res.status(500).json({ error: 'Transcription service error', details: errorText });
    }
    
    const result = await response.json();
    const transcribedText = result.text?.trim() || '';
    
    return res.status(200).json({ text: transcribedText });
    
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ error: 'Failed to transcribe audio', details: error.message });
  }
}
