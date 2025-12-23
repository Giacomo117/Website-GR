import React, { useState, useRef, useCallback, useEffect } from 'react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

// Check for Web Speech API support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceAssistant = ({ onOpenChatWithMessage }) => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDetected, setVoiceDetected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'it-IT'; // Italian by default
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setVoiceDetected(false);
    };
    
    recognition.onaudiostart = () => {
      console.log('Audio capturing started');
    };
    
    recognition.onspeechstart = () => {
      console.log('Speech detected');
      setVoiceDetected(true);
    };
    
    recognition.onspeechend = () => {
      console.log('Speech ended');
      setVoiceDetected(false);
    };
    
    recognition.onresult = (event) => {
      console.log('Recognition result:', event);
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        console.log('Transcript:', transcript, 'isFinal:', event.results[i].isFinal);
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      
      if (final) {
        setTranscription(prev => (prev + final).trim());
      }
      setInterimTranscript(interim);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Start recording
  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    
    setError(null);
    setTranscription('');
    setInterimTranscript('');
    
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Could not start speech recognition. Please try again.');
    }
  }, []);

  // Stop recording and open chat with transcription
  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setInterimTranscript('');
    
    // Get the final transcription (we need to wait a tiny bit for final results)
    setTimeout(() => {
      setTranscription(current => {
        if (current && current.trim() && onOpenChatWithMessage) {
          // Open chat with the transcription in the input field (not auto-send)
          onOpenChatWithMessage({
            message: current.trim(),
            context: GIACOMO_CONTEXT,
            prefillInput: true  // This puts text in input field, not auto-sends
          });
          // Clear transcription after opening chat
          return '';
        }
        return current;
      });
    }, 100);
  }, [onOpenChatWithMessage]);

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
    setInterimTranscript('');
    setError(null);
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
            {t('voice.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 font-['Space_Grotesk'] max-w-2xl mx-auto">
            {t('voice.subtitle')}
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
                <span className="text-white text-sm font-semibold">{t('voice.recording')}</span>
              </div>
            )}
            
            {/* Live transcript indicator */}
            {isRecording && interimTranscript && (
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-zinc-900/90 px-4 py-2 rounded-lg max-w-xs text-center">
                <span className="text-cyan-400 text-sm italic">{interimTranscript}</span>
              </div>
            )}
          </div>

          {/* Control Button */}
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            disabled={!isSupported}
            className={`px-10 py-5 text-lg md:text-xl rounded-full transition-all duration-300 font-semibold ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/50' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-xl shadow-cyan-500/50'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-6 h-6 mr-3" />
                {t('voice.stopRecording')}
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 mr-3" />
                {t('voice.startRecording')}
              </>
            )}
          </Button>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-3 rounded-lg text-center max-w-md animate-in fade-in duration-300">
              {error}
            </div>
          )}

          {/* Live transcription preview while recording */}
          {isRecording && (transcription || interimTranscript) && (
            <div className="w-full max-w-2xl bg-zinc-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4 animate-in fade-in duration-300">
              <p className="text-gray-400 text-sm mb-2">{t('voice.transcribing')}</p>
              <p className="text-white">
                {transcription}
                <span className="text-cyan-400 opacity-70">{interimTranscript}</span>
              </p>
            </div>
          )}

          {/* Instructions */}
          <p className="text-gray-500 text-center text-base md:text-lg max-w-lg">
            {isRecording 
              ? t('voice.speakClearly')
              : t('voice.clickButton')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistant;
