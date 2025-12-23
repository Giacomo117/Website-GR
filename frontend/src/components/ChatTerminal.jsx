import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

// Use relative URL for Cloudflare Functions (or fallback to localhost for dev)
const API = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api';

// Virtual filesystem structure
const FILESYSTEM = {
  '~': {
    type: 'dir',
    children: {
      'about.txt': { type: 'file', content: `Giacomo Reggianini - AI & Software Engineer

Computer Engineer specializing in Artificial Intelligence with experience in developing distributed systems and enterprise architectures. Master's graduate in Artificial Intelligence Engineering (Autumn 2025).

Throughout my academic journey, I have developed cross-functional skills through innovative projects completed both in Modena and during my Erasmus experience in England, ranging from mobile development to IoT, from computer vision to enterprise-grade RAG systems.

These experiences have enabled me to acquire solid competencies in teamwork, complex project management, and adaptation to diverse technological contexts, always with the goal of transforming innovative ideas into concrete and scalable solutions.` },
      'contact.txt': { type: 'file', content: 'Email: reggianini.giacomo01@gmail.com\nPhone: (+39) 329 449 4417\nLinkedIn: linkedin.com/in/giacomo-reggianini-0667bb300\nGitHub: github.com/Giacomo117' },
      'projects': {
        type: 'dir',
        children: {
          'civetta.md': { type: 'file', content: `# Civetta - Enterprise RAG Platform
Associated with E38

A distributed Retrieval-Augmented Generation (RAG) system serving as an intelligent virtual assistant for enterprise environments, built on scalable microservices architecture with multi-tenant support and no-code document management capabilities.

The system combines advanced document processing, vector search, and LLM orchestration to deliver domain-specific AI assistance across legal, business intelligence, and customer support sectors.

## Core Architecture

1. Microservices Implementation
   TypeScript-based orchestrator and frontend with Python-based RAG pipeline, ensuring production-level robustness and research-grade flexibility for document processing.

2. Multi-Modal Document Processing
   Four specialized chunking pipelines:
   - Mistral OCR for PDFs
   - Semantic chunking
   - Section-based analysis
   - LLaMA 3 70B Z-chunking for optimal content segmentation

3. Advanced RAG Pipeline
   Redis-based vector database with similarity search, image processing integration using vision models, and contextual caption generation through o1-mini LLM refinement.

## Enterprise Features

- Multi-tenant orchestration with client isolation and dynamic onboarding
- No-code frontend interface for autonomous document upload, API key management, and pipeline configuration
- Real-time streaming responses via Server-Sent Events
- Comprehensive observability and monitoring infrastructure
- Integration with MinIO object storage and Azure OpenAI for LLM inference

Technologies: Python, TypeScript, Angular, LangChain, Redis, MinIO, Azure OpenAI` },
          'autoguardian.md': { type: 'file', content: `# AutoGuardian
IoT Vehicle Safety Platform

A modular IoT platform for vehicle safety monitoring and neighbor-aware emergency alerting, featuring real-time telemetry processing, anomaly detection, and distributed alert dissemination.

The system connects Arduino/MCU devices via serial communication to a Django REST API backend, with MQTT-based alert broadcasting for low-latency emergency response coordination between nearby vehicles.

## Key Features

- Smart anomaly detection with false-positive suppression by comparing sensor readings across neighboring vehicles
- Geospatial neighbor discovery using distance calculations
- Web-based dashboard providing real-time vehicle monitoring, alert management, and system overview
- REST-first design with clean separation of concerns
- Comprehensive API endpoints for vehicles, alerts, and contact management

Technologies: Arduino, Django, MQTT, Mosquitto, Python, IoT
GitHub: github.com/Giacomo117/AutoGuardian` },
          'drowsiness-detector.md': { type: 'file', content: `# Drowsiness State Detector
Real-time Driver Monitoring System

A multi-model computer vision application for real-time driver drowsiness detection, composed of three standalone deep learning models working in parallel through multi-threaded processing.

Real-time performance achieved through concurrent model inference on webcam input, with OpenCV Haar cascades handling face detection and eye region extraction. A 10-second sliding buffer aggregates detection results for stable drowsiness assessment based on eye closure frequency, yawn rate, and head rotation metrics.

## The Three Models

1. Eye State Classification
   MobileNetV2 classifier trained to distinguish between open/closed eyes on extracted eye regions

2. Yawn Detection
   MobileNet trained for binary yawn classification from facial crops

3. Facial Keypoint Estimation
   PyTorch ResNet50 predicting 68 facial landmarks for head pose analysis

Technologies: Python, OpenCV, PyTorch, TensorFlow, Deep Learning
GitHub: github.com/Giacomo117/Drowsiness-State-Detector` },
          'graph-routing.md': { type: 'file', content: `# Routing Algorithm for Graph DBs
Associated with Universita di Modena e Reggio Emilia

A multi-modal routing system for public transportation networks using Neo4j graph database technology, implementing optimized pathfinding algorithms for real-world transit data.

The system processes GTFS (General Transit Feed Specification) data for Modena, Italy, combining bus routes with pedestrian transfers to provide comprehensive journey planning with time-dependent scheduling and geospatial proximity search.

## Core Components

1. Graph Database Design
   Neo4j implementation with custom data model representing agencies, routes, trips, stops, and stoptimes with time-dependent relationships

2. Multi-Modal Pathfinding
   Dijkstra algorithm implementation using Graph Data Science (GDS) library with custom waiting_time weights for optimal route calculation

3. Geospatial Integration
   Proximity search functionality using Neo4j spatial functions to find nearby stops within configurable radius from arbitrary coordinates

Technologies: Neo4j, Python, Graph Data Science, GTFS, Cypher` },
        }
      },
      'skills': {
        type: 'dir',
        children: {
          'languages.txt': { type: 'file', content: 'Python, JavaScript, TypeScript, C++, Java, SQL' },
          'frameworks.txt': { type: 'file', content: 'React, FastAPI, Django, LangChain, PyTorch, TensorFlow' },
          'tools.txt': { type: 'file', content: 'Git, Docker, Kubernetes, AWS, Azure, Linux' },
        }
      },
      '.secret': { type: 'file', content: 'Congrats! You found the secret file.' },
    }
  }
};

// Command history for arrow navigation
const ChatTerminal = ({ isOpen, onClose, projectMessage, projectContext, autoSendMessage, onAutoSendProcessed, prefillInput, onPrefillProcessed }) => {
  const { t, language } = useLanguage();
  
  const getWelcomeMessage = () => ({
    type: 'system', 
    output: `${t('terminal.welcome')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${t('terminal.helpText')}
` 
  });

  const [history, setHistory] = useState([getWelcomeMessage()]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState([]);
  const [activeContext, setActiveContext] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSendProcessed, setAutoSendProcessed] = useState(false);
  const bottomRef = useRef(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Update welcome message when language changes
  useEffect(() => {
    setHistory(prev => {
      if (prev.length === 1 && prev[0].type === 'system') {
        return [getWelcomeMessage()];
      }
      return prev;
    });
  }, [language]);

  // Get directory content from path
  const getNode = (path) => {
    const parts = path.split('/').filter(p => p && p !== '~');
    let current = FILESYSTEM['~'];
    for (const part of parts) {
      if (current.type !== 'dir' || !current.children[part]) return null;
      current = current.children[part];
    }
    return current;
  };

  // Standard terminal commands
  const terminalCommands = {
    help: () => `Available commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  help          - Show this help message
  ls            - List directory contents
  ls -la        - List all files including hidden
  cd <dir>      - Change directory
  cat <file>    - Display file contents
  pwd           - Print working directory
  clear         - Clear terminal
  whoami        - Display current user
  date          - Show current date/time
  echo <text>   - Print text
  neofetch      - System information
  
Or just type any question to ask the AI about Giacomo.`,

    ls: (args) => {
      const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const node = getNode(currentPath);
      if (!node || node.type !== 'dir') return 'Not a directory';
      
      const items = Object.entries(node.children)
        .filter(([name]) => showHidden || !name.startsWith('.'))
        .map(([name, item]) => {
          if (item.type === 'dir') return `${name}/`;
          return name;
        });
      
      return items.join('  ') || '(empty)';
    },

    cd: (args) => {
      const target = args[0] || '~';
      
      if (target === '~' || target === '/') {
        setCurrentPath('~');
        return '';
      }
      
      if (target === '..') {
        const parts = currentPath.split('/').filter(p => p);
        if (parts.length > 1) {
          parts.pop();
          setCurrentPath(parts.join('/'));
        } else {
          setCurrentPath('~');
        }
        return '';
      }
      
      if (target === '.') return '';
      
      const newPath = currentPath === '~' ? `~/${target}` : `${currentPath}/${target}`;
      const node = getNode(newPath);
      
      if (!node) return `cd: ${target}: No such file or directory`;
      if (node.type !== 'dir') return `cd: ${target}: Not a directory`;
      
      setCurrentPath(newPath);
      return '';
    },

    cat: (args) => {
      if (!args[0]) return 'cat: missing file operand';
      const filePath = currentPath === '~' ? `~/${args[0]}` : `${currentPath}/${args[0]}`;
      const node = getNode(filePath);
      
      if (!node) return `cat: ${args[0]}: No such file or directory`;
      if (node.type === 'dir') return `cat: ${args[0]}: Is a directory`;
      
      return node.content;
    },

    pwd: () => currentPath.replace('~', '/home/visitor'),

    clear: () => {
      setHistory([]);
      return null; // null means don't add output
    },

    whoami: () => 'visitor',

    date: () => new Date().toString(),

    echo: (args) => args.join(' '),

    neofetch: () => `
       ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄       visitor@giacomo-terminal
      ████████████████████      ━━━━━━━━━━━━━━━━━━━━━━━━
     ██████████████████████     OS: Giacomo's Portfolio OS
    ████████████████████████    Host: github.com/Giacomo117
    ████████  ████  ████████    Kernel: React 18.x
    ████████  ████  ████████    Uptime: Always Online
    ████████  ████  ████████    Shell: AI-Powered Bash
    ████████████████████████    Terminal: ChatTerminal v2.0
     ██████████████████████     CPU: OpenRouter AI
      ████████████████████      Memory: Unlimited Knowledge
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀       
`,

    exit: () => {
      onClose();
      return 'Session terminated.';
    },
  };

  // Handle project message and context
  useEffect(() => {
    if (isOpen && projectMessage) {
      setHistory(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.type === 'project' && lastMessage?.output === projectMessage) {
          return prev;
        }
        return [...prev, { type: 'project', output: projectMessage }];
      });
      // Set the active context for AI queries
      if (projectContext) {
        setActiveContext(projectContext);
      }
    }
  }, [isOpen, projectMessage, projectContext]);

  // Handle auto-send message (from voice assistant)
  useEffect(() => {
    if (isOpen && autoSendMessage && !autoSendProcessed && !isLoading) {
      setAutoSendProcessed(true);
      // Set the context first
      if (projectContext) {
        setActiveContext(projectContext);
      }
      // Auto-send the message after a brief delay to allow terminal to render
      const timer = setTimeout(async () => {
        const userMessage = autoSendMessage.trim();
        const displayPath = currentPath.replace('~', '~');
        
        // Add user message to history
        setHistory(prev => [...prev, { type: 'user', command: userMessage, path: displayPath }]);
        
        // Start loading and call AI
        setIsLoading(true);
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userMessage,
              context: projectContext || null
            })
          });
          
          const data = await response.json();
          
          if (response.ok && data.response) {
            setHistory(prev => [...prev, { type: 'ai', output: data.response }]);
          } else {
            setHistory(prev => [...prev, { type: 'error', output: data.detail || data.error || 'Failed to get response' }]);
          }
        } catch (error) {
          console.error('Auto-send error:', error);
          setHistory(prev => [...prev, { type: 'error', output: 'Connection error. Please try again.' }]);
        } finally {
          setIsLoading(false);
        }
        
        if (onAutoSendProcessed) {
          onAutoSendProcessed();
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoSendMessage, autoSendProcessed, isLoading, projectContext, currentPath, onAutoSendProcessed]);

  // Reset autoSendProcessed when terminal closes
  useEffect(() => {
    if (!isOpen) {
      setAutoSendProcessed(false);
    }
  }, [isOpen]);

  // Handle prefill input (from voice assistant - puts text in input field)
  useEffect(() => {
    if (isOpen && prefillInput) {
      setCurrentCommand(prefillInput);
      // Set context if provided
      if (projectContext) {
        setActiveContext(projectContext);
      }
      if (onPrefillProcessed) {
        onPrefillProcessed();
      }
    }
  }, [isOpen, prefillInput, projectContext, onPrefillProcessed]);

  const handleCommand = async (message = currentCommand) => {
    if (isLoading) return;
    
    const userMessage = message.trim();
    const displayPath = currentPath.replace('~', '~');
    
    // Add to command history
    if (userMessage) {
      setCommandHistory(prev => [...prev, userMessage]);
      setHistoryIndex(-1);
    }
    
    // Show the command in history
    setHistory(prev => [...prev, { type: 'user', command: userMessage, path: displayPath }]);
    setCurrentCommand('');
    
    // Empty command = just new line
    if (!userMessage) return;

    // Parse command
    const parts = userMessage.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check for standard terminal commands
    if (terminalCommands[cmd]) {
      const output = terminalCommands[cmd](args);
      if (output !== null) {
        setHistory(prev => [...prev, { type: 'output', output }]);
      }
      return;
    }

    // Special commands
    if (cmd === 'sudo') {
      setHistory(prev => [...prev, { type: 'error', output: 'visitor is not in the sudoers file. This incident will be reported.' }]);
      return;
    }

    if (cmd === 'rm' && args.includes('-rf')) {
      setHistory(prev => [...prev, { type: 'output', output: 'Permission denied: read-only filesystem.' }]);
      return;
    }

    if (['vim', 'nano', 'vi'].includes(cmd)) {
      setHistory(prev => [...prev, { type: 'output', output: `${cmd}: command not found` }]);
      return;
    }

    // Unknown command - ask AI
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        context: activeContext
      });
      setHistory(prev => [...prev, { type: 'assistant', output: response.data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = 'Connection error. Try again!';
      if (error.response?.status === 429) {
        errorMessage = error.response?.data?.detail || 'Rate limit exceeded. Please wait.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      setHistory(prev => [...prev, { type: 'error', output: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Ctrl+C - cancel/new line
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      const displayPath = currentPath.replace('~', '~');
      if (currentCommand) {
        setHistory(prev => [...prev, { type: 'user', command: currentCommand + '^C', path: displayPath }]);
      } else {
        setHistory(prev => [...prev, { type: 'user', command: '^C', path: displayPath }]);
      }
      setCurrentCommand('');
      setIsLoading(false);
      return;
    }

    // Ctrl+L - clear screen
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
      return;
    }

    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
      return;
    }

    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
      return;
    }

    // Tab - autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = currentCommand.split(/\s+/);
      const lastPart = parts[parts.length - 1];
      const node = getNode(currentPath);
      
      if (node && node.type === 'dir') {
        const matches = Object.keys(node.children).filter(name => name.startsWith(lastPart));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          setCurrentCommand(parts.join(' '));
        }
      }
      return;
    }

    // Enter - execute command
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommand();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Keep focus on input after every history change (after sending command)
  useEffect(() => {
    if (isOpen && !isLoading) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [history, isOpen, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2 md:p-4 lg:p-6">
      <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-black rounded-lg overflow-hidden shadow-2xl border border-cyan-500 animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Terminal Header - Smaller on Mobile */}
        <div className="flex items-center justify-between gap-2 p-2 md:p-3 lg:p-4 bg-zinc-900 text-xs text-gray-400 border-b border-cyan-500/30">
          <div className="flex gap-1 md:gap-1.5">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" onClick={onClose} />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center font-semibold font-['Space_Grotesk'] text-cyan-400 text-[10px] md:text-xs lg:text-sm truncate">
            giacomo@ai-assistant:~$
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} className="md:w-4 md:h-4 lg:w-5 lg:h-5" />
          </button>
        </div>

        {/* Terminal Output - Responsive sizing for different screen sizes */}
        <div 
          ref={terminalRef} 
          className="h-[70vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] max-h-[500px] lg:max-h-[600px] xl:max-h-[700px] 2xl:max-h-[800px] overflow-y-auto p-2 md:p-4 lg:p-5 xl:p-6 space-y-1 md:space-y-2 bg-black cursor-text text-xs md:text-sm lg:text-base font-mono"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00D9FF #1f2937'
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, i) => (
            <div key={i}>
              {entry.type === 'user' && (
                <div className="flex gap-1 md:gap-2 lg:gap-3 flex-wrap">
                  <span className="text-green-400 font-semibold whitespace-nowrap text-[10px] md:text-xs lg:text-sm">visitor@giacomo</span>
                  <span className="text-white font-semibold text-[10px] md:text-xs lg:text-sm">:</span>
                  <span className="text-blue-400 font-semibold text-[10px] md:text-xs lg:text-sm">{entry.path || '~'}</span>
                  <span className="text-white font-semibold text-[10px] md:text-xs lg:text-sm">$</span>
                  <span className="text-white break-words text-[10px] md:text-xs lg:text-sm">{entry.command}</span>
                </div>
              )}
              {entry.type === 'project' && (
                <div className="flex gap-1 md:gap-2 lg:gap-3 items-start">
                  <span className="text-yellow-400 font-semibold whitespace-nowrap text-[10px] md:text-xs lg:text-sm">[hint]</span>
                  <span className="text-yellow-400 break-words text-[10px] md:text-xs lg:text-sm">{entry.output}</span>
                </div>
              )}
              {entry.type === 'output' && (
                <div className="whitespace-pre-wrap leading-relaxed break-words text-[10px] md:text-xs lg:text-sm text-white">
                  {entry.output}
                </div>
              )}
              {entry.type === 'system' && (
                <div className="whitespace-pre-wrap leading-relaxed break-words text-[10px] md:text-xs lg:text-sm text-cyan-400">
                  {entry.output}
                </div>
              )}
              {entry.type === 'assistant' && (
                <div className="whitespace-pre-wrap leading-relaxed break-words text-[10px] md:text-xs lg:text-sm text-gray-300 pl-0">
                  {entry.output}
                </div>
              )}
              {entry.type === 'error' && (
                <div className="whitespace-pre-wrap leading-relaxed break-words text-[10px] md:text-xs lg:text-sm text-red-400">
                  {entry.output}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-1 md:gap-2 lg:gap-3 items-center text-cyan-400">
              <Loader2 size={12} className="md:w-4 md:h-4 lg:w-5 lg:h-5 animate-spin" />
              <span className="text-[10px] md:text-xs lg:text-sm">Processing...</span>
            </div>
          )}

          {/* Current Command Input */}
          <div className="flex gap-1 md:gap-2 lg:gap-3 items-center">
            <span className="text-green-400 font-semibold whitespace-nowrap text-[10px] md:text-xs lg:text-sm">visitor@giacomo</span>
            <span className="text-white font-semibold text-[10px] md:text-xs lg:text-sm">:</span>
            <span className="text-blue-400 font-semibold text-[10px] md:text-xs lg:text-sm">{currentPath}</span>
            <span className="text-white font-semibold text-[10px] md:text-xs lg:text-sm">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={e => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-white caret-white disabled:opacity-50 min-w-0 text-[16px] md:text-xs lg:text-sm leading-none font-mono scale-[0.625] md:scale-100 origin-left -mr-[37.5%] md:mr-0"
              style={{ touchAction: 'manipulation' }}
              spellCheck="false"
              autoComplete="off"
            />
            <span className="text-white animate-pulse text-[10px] md:text-xs lg:text-sm">█</span>
          </div>

          <div ref={bottomRef} />
        </div>
        
        {/* Terminal Footer */}
        <div className="bg-zinc-900 px-2 md:px-4 lg:px-5 py-1.5 md:py-2 lg:py-3 text-[9px] md:text-xs lg:text-sm text-gray-500 border-t border-cyan-500/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 md:gap-2">
            <span className="text-center sm:text-left">Ctrl+C: cancel • Ctrl+L: clear • ↑↓: history • Tab: autocomplete</span>
            <span className="text-cyan-400">● ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTerminal;