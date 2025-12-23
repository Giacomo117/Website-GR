import React, { useState, useRef, useCallback, useEffect } from 'react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';
import { Button } from './ui/button';
import { Mic, MicOff, Send, X, Loader2 } from 'lucide-react';

// API endpoint (same as chat)
const API = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api';

// Rate limiting configuration (client-side)
const RATE_LIMIT = 5; // requests per minute
const RATE_WINDOW = 60000; // 60 seconds in milliseconds

// Context about Giacomo for the AI
const GIACOMO_CONTEXT = `
ABOUT GIACOMO REGGIANINI:
Giacomo Reggianini - AI & Software Engineer

Computer Engineer specializing in Artificial Intelligence with experience in developing distributed systems and enterprise architectures. Master's graduate in Artificial Intelligence Engineering (Autumn 2025).

Throughout his academic journey, he has developed cross-functional skills through innovative projects completed both in Modena and during his Erasmus experience in England, ranging from mobile development to IoT, from computer vision to enterprise-grade RAG systems.

These experiences have enabled him to acquire solid competencies in teamwork, complex project management, and adaptation to diverse technological contexts, always with the goal of transforming innovative ideas into concrete and scalable solutions.

CONTACT:
Email: reggianini.giacomo01@gmail.com
Phone: (+39) 329 449 4417
LinkedIn: linkedin.com/in/giacomo-reggianini-0667bb300
GitHub: github.com/Giacomo117

SKILLS:
Languages: Python, JavaScript, TypeScript, C++, Java, SQL
Frameworks: React, FastAPI, Django, LangChain, PyTorch, TensorFlow
Tools: Git, Docker, Kubernetes, AWS, Azure, Linux

PROJECTS:

1. CIVETTA - Enterprise RAG Platform (Associated with E38)
A distributed Retrieval-Augmented Generation (RAG) system serving as an intelligent virtual assistant for enterprise environments, built on scalable microservices architecture with multi-tenant support and no-code document management capabilities.
The system combines advanced document processing, vector search, and LLM orchestration to deliver domain-specific AI assistance across legal, business intelligence, and customer support sectors.
Core Architecture:
- Microservices Implementation: TypeScript-based orchestrator and frontend with Python-based RAG pipeline
- Multi-Modal Document Processing: Four specialized chunking pipelines including Mistral OCR for PDFs, semantic chunking, section-based analysis, and LLaMA 3 70B Z-chunking
- Advanced RAG Pipeline: Redis-based vector database with similarity search, image processing integration
Enterprise Features: Multi-tenant orchestration, no-code frontend interface, real-time streaming via SSE, comprehensive observability
Technologies: Python, TypeScript, Angular, LangChain, Redis, MinIO, Azure OpenAI

2. AUTOGUARDIAN - IoT Vehicle Safety Platform
A modular IoT platform for vehicle safety monitoring and neighbor-aware emergency alerting, featuring real-time telemetry processing, anomaly detection, and distributed alert dissemination.
Key Features:
- Smart anomaly detection with false-positive suppression
- Geospatial neighbor discovery
- Web-based dashboard for real-time monitoring
- REST-first design with clean separation of concerns
Technologies: Arduino, Django, MQTT, Mosquitto, Python, IoT
GitHub: github.com/Giacomo117/AutoGuardian

3. DROWSINESS STATE DETECTOR - Real-time Driver Monitoring System
A multi-model computer vision application for real-time driver drowsiness detection, composed of three standalone deep learning models working in parallel through multi-threaded processing.
The Three Models:
- Eye State Classification: MobileNetV2 classifier for open/closed eyes
- Yawn Detection: MobileNet for binary yawn classification
- Facial Keypoint Estimation: PyTorch ResNet50 predicting 68 facial landmarks
Technologies: Python, OpenCV, PyTorch, TensorFlow, Deep Learning
GitHub: github.com/Giacomo117/Drowsiness-State-Detector

4. ROUTING ALGORITHM FOR GRAPH DBs (Associated with Universita di Modena e Reggio Emilia)
A multi-modal routing system for public transportation networks using Neo4j graph database technology, implementing optimized pathfinding algorithms for real-world transit data.
Core Components:
- Graph Database Design with Neo4j
- Multi-Modal Pathfinding with Dijkstra algorithm
- Geospatial Integration for proximity search
Technologies: Neo4j, Python, Graph Data Science, GTFS, Cypher

EDUCATION:
Master's in Artificial Intelligence Engineering (Autumn 2025) - Università di Modena e Reggio Emilia
Erasmus experience in England for international exposure
`;

// Rate limiter class
class ClientRateLimiter {
  constructor() {
    this.requests = [];
  }

  checkLimit() {
    const now = Date.now();
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < RATE_WINDOW);
    
    if (this.requests.length >= RATE_LIMIT) {
      const oldestRequest = this.requests[0];
      const retryAfter = Math.ceil((RATE_WINDOW - (now - oldestRequest)) / 1000);
      return { allowed: false, retryAfter };
    }
    
    this.requests.push(now);
    return { allowed: true };
  }
}

const rateLimiter = new ClientRateLimiter();

const VoiceAssistant = ({ onOpenChatWithMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitError, setRateLimitError] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Start recording with MediaRecorder for OpenRouter
  const startRecording = useCallback(async () => {
    // Check rate limit first
    const rateCheck = rateLimiter.checkLimit();
    if (!rateCheck.allowed) {
      setRateLimitError(`Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`);
      setTimeout(() => setRateLimitError(null), 5000);
      return;
    }

    try {
      setError(null);
      setRateLimitError(null);
      setTranscription('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      // Use webm if supported, otherwise mp4
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          await transcribeWithOpenRouter();
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please allow microphone access.');
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
  }, []);

  // Transcribe audio using OpenRouter's Gemini model
  const transcribeWithOpenRouter = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    setIsTranscribing(true);
    setError(null);
    
    try {
      // Create audio blob
      const mimeType = audioChunksRef.current[0]?.type || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      // Check if audio is too short (less than 0.5 seconds of data)
      if (audioBlob.size < 5000) {
        setError('Recording too short. Please speak longer.');
        return;
      }
      
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      
      // Call the Cloudflare Function transcribe endpoint
      const response = await fetch(`${API}/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.status === 429) {
        setRateLimitError(data.detail || 'Rate limit exceeded. Please wait.');
        return;
      }
      
      if (!response.ok) {
        console.error('Transcription API error:', data);
        setError(data.error || 'Transcription failed. Please try again.');
        return;
      }
      
      if (data.text && data.text.trim()) {
        setTranscription(data.text.trim());
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('No speech detected. Please try again.');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError('Could not transcribe audio. Please try again or type your question.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle sending the message to chat
  const handleSendMessage = useCallback(() => {
    if (!transcription.trim()) return;
    
    // Open chat with the transcription and context
    if (onOpenChatWithMessage) {
      onOpenChatWithMessage({
        message: transcription,
        context: GIACOMO_CONTEXT,
        autoSend: true
      });
    }
    
    // Reset state
    setTranscription('');
  }, [transcription, onOpenChatWithMessage]);

  // Handle key press in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear transcription
  const handleClear = () => {
    setTranscription('');
    setError(null);
    setRateLimitError(null);
  };

  return (
    <section id="voice-assistant" className="relative py-24 md:py-32 lg:py-40 bg-black overflow-hidden min-h-[80vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black pointer-events-none" />
      
      {/* Animated background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 w-full">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 font-['Space_Grotesk'] mb-6">
            Ask Me Anything
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-['Space_Grotesk'] max-w-2xl mx-auto">
            Curious about my projects, skills, or experience? Just ask!
          </p>
        </div>

        {/* Orb Container */}
        <div className="flex flex-col items-center space-y-8 md:space-y-12">
          {/* Voice Powered Orb - Larger */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
            {/* Glow effect behind orb */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isRecording 
                ? 'bg-cyan-500/30 blur-3xl scale-125' 
                : 'bg-purple-500/15 blur-3xl'
            }`} />
            
            <VoicePoweredOrb
              enableVoiceControl={isRecording}
              className="rounded-full overflow-hidden"
              onVoiceDetected={setVoiceDetected}
              hue={isRecording ? 180 : 270}
              voiceSensitivity={2.0}
              maxRotationSpeed={1.5}
              maxHoverIntensity={1.0}
            />

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500/90 px-4 py-2 rounded-full animate-pulse shadow-lg shadow-red-500/50">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                <span className="text-white text-sm font-semibold">Recording...</span>
              </div>
            )}
            
            {/* Transcribing indicator */}
            {isTranscribing && (
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-cyan-500/90 px-4 py-2 rounded-full shadow-lg shadow-cyan-500/50">
                <Loader2 className="w-4 h-4 text-black animate-spin" />
                <span className="text-black text-sm font-semibold">Transcribing...</span>
              </div>
            )}
          </div>

          {/* Control Button */}
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            disabled={isTranscribing}
            className={`px-10 py-5 text-lg md:text-xl rounded-full transition-all duration-300 font-semibold ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/50' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-xl shadow-cyan-500/50'
            }`}
          >
            {isTranscribing ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Processing...
              </>
            ) : isRecording ? (
              <>
                <MicOff className="w-6 h-6 mr-3" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 mr-3" />
                Start Recording
              </>
            )}
          </Button>

          {/* Rate limit error */}
          {rateLimitError && (
            <div className="bg-orange-500/20 border border-orange-500/50 text-orange-400 px-6 py-3 rounded-lg text-center max-w-md animate-in fade-in duration-300">
              {rateLimitError}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-3 rounded-lg text-center max-w-md animate-in fade-in duration-300">
              {error}
            </div>
          )}

          {/* Transcription display and send */}
          {transcription && (
            <div className="w-full max-w-2xl bg-zinc-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label className="text-cyan-400 text-sm font-medium mb-2 block">
                    Your question:
                  </label>
                  <textarea
                    value={transcription}
                    onChange={(e) => setTranscription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-black/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none text-base"
                    rows={3}
                    placeholder="Edit your question if needed..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="default"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={handleSendMessage}
                  size="default"
                  disabled={!transcription.trim()}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-50 font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <p className="text-gray-500 text-center text-base md:text-lg max-w-lg">
            {isRecording 
              ? "Speak clearly, then click 'Stop Recording' when done"
              : isTranscribing
                ? "Converting your speech to text..."
                : "Click the button and ask me anything about my projects, skills, or experience!"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistant;
