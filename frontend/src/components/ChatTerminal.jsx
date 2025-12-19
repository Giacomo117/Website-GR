import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';

// Use relative URL for Cloudflare Functions (or fallback to localhost for dev)
const API = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api';

// Virtual filesystem structure
const FILESYSTEM = {
  '~': {
    type: 'dir',
    children: {
      'about.txt': { type: 'file', content: 'Giacomo Raimondi - AI & Software Engineer\nPassionate about building intelligent systems.' },
      'contact.txt': { type: 'file', content: 'Email: giacomo.raimondi@example.com\nLinkedIn: linkedin.com/in/giacomoraimondi\nGitHub: github.com/Giacomo117' },
      'projects': {
        type: 'dir',
        children: {
          'civetta.md': { type: 'file', content: '# Civetta - Enterprise RAG Platform\nA distributed RAG system for enterprise environments.\nTechnologies: Python, LangChain, Microservices' },
          'autoguardian.md': { type: 'file', content: '# AutoGuardian\nIoT platform for vehicle safety monitoring.\nTechnologies: Arduino, Django, MQTT' },
          'drowsiness-detector.md': { type: 'file', content: '# Drowsiness State Detector\nReal-time driver drowsiness detection using computer vision.\nTechnologies: Python, OpenCV, PyTorch' },
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
      '.secret': { type: 'file', content: 'You found the secret file. Ask the AI about Giacomo\'s hidden talents.' },
    }
  }
};

// Command history for arrow navigation
const ChatTerminal = ({ isOpen, onClose, projectMessage }) => {
  const [history, setHistory] = useState([
    { 
      type: 'system', 
      output: `Welcome to Giacomo's Interactive Terminal v2.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ask me what you want! Or type 'help' for available commands.
` 
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

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

  // Handle project message
  useEffect(() => {
    if (isOpen && projectMessage) {
      setHistory(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.type === 'project' && lastMessage?.output === projectMessage) {
          return prev;
        }
        return [...prev, { type: 'project', output: projectMessage }];
      });
    }
  }, [isOpen, projectMessage]);

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
        message: userMessage
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
              className="flex-1 bg-transparent outline-none text-white caret-white disabled:opacity-50 min-w-0 text-[10px] md:text-xs lg:text-sm leading-none font-mono"
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