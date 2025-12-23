import React, { useState, useRef, useCallback, useEffect } from 'react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';
import { Button } from './ui/button';
import { Mic, MicOff, Send, X, Loader2 } from 'lucide-react';

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

// Check if SpeechRecognition is available
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceAssistant = ({ onOpenChatWithMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(!!SpeechRecognition);
  
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (final) {
          setTranscription(prev => prev + final);
        }
        setInterimTranscription(interim);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          // Don't show error for no-speech, just continue listening
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimTranscription('');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setTranscription('');
      setInterimTranscription('');

      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Request microphone access first (for the orb visualization)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
        streamRef.current = stream;
      } catch (err) {
        console.warn('Could not access microphone for visualization:', err);
      }

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not start recording. Please try again.');
    }
  }, []);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors
      }
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsRecording(false);
    setInterimTranscription('');
  }, []);

  // Handle sending the message to chat
  const handleSendMessage = useCallback(() => {
    const messageToSend = (transcription + interimTranscription).trim();
    if (!messageToSend) return;
    
    // Open chat with the transcription and context
    if (onOpenChatWithMessage) {
      onOpenChatWithMessage({
        message: messageToSend,
        context: GIACOMO_CONTEXT,
        autoSend: true
      });
    }
    
    // Reset state
    setTranscription('');
    setInterimTranscription('');
    stopRecording();
  }, [transcription, interimTranscription, onOpenChatWithMessage, stopRecording]);

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
    setInterimTranscription('');
    setError(null);
  };

  const displayText = transcription + interimTranscription;

  return (
    <section id="voice-assistant" className="relative py-16 md:py-24 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        {/* Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 font-['Space_Grotesk'] mb-4 animate-pulse">
            Ask Me Anything
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-['Space_Grotesk']">
            Curious about my projects, skills, or experience? Just ask!
          </p>
        </div>

        {/* Orb Container */}
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {/* Voice Powered Orb */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Glow effect behind orb */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isRecording 
                ? 'bg-cyan-500/20 blur-3xl scale-110' 
                : 'bg-purple-500/10 blur-2xl'
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
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-500/90 px-3 py-1.5 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-white text-sm font-medium">Listening...</span>
              </div>
            )}
          </div>

          {/* Control Button */}
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            disabled={isTranscribing || !isSpeechSupported}
            className={`px-8 py-4 text-base md:text-lg rounded-full transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/50'
            }`}
          >
            {isTranscribing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : isRecording ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </>
            )}
          </Button>

          {/* Browser not supported message */}
          {!isSpeechSupported && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded-lg text-center max-w-md">
              Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-center max-w-md">
              {error}
            </div>
          )}

          {/* Live transcription display */}
          {(isRecording || displayText) && (
            <div className="w-full max-w-xl bg-zinc-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label className="text-cyan-400 text-sm font-medium mb-2 block flex items-center gap-2">
                    {isRecording && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                    {isRecording ? 'Live transcription:' : 'Your question:'}
                  </label>
                  <textarea
                    value={displayText}
                    onChange={(e) => {
                      setTranscription(e.target.value);
                      setInterimTranscription('');
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-black/50 border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
                    rows={3}
                    placeholder={isRecording ? "Speak now..." : "Edit your question if needed..."}
                  />
                  {interimTranscription && (
                    <p className="text-gray-500 text-xs mt-1 italic">
                      Still listening...
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:text-white hover:border-gray-500"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!displayText.trim()}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-50"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Ask AI
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <p className="text-gray-500 text-center text-sm md:text-base max-w-md">
            {isRecording 
              ? "Speak clearly — your words will appear in real-time"
              : "Click the button and ask me anything about my projects, skills, or experience!"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistant;
