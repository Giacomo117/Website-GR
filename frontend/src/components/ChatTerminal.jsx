import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatTerminal = ({ isOpen, onClose, projectMessage }) => {
  const [history, setHistory] = useState([
    { 
      type: 'system', 
      output: `[SYSTEM INITIALIZED] - Giacomo's AI Assistant Terminal v1.0

Hi! I'm Giacomo's AI assistant. Ask me anything about him!
Type your question and press Enter.` 
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Handle project message - show as system message, don't auto-send
  useEffect(() => {
    if (isOpen && projectMessage) {
      setHistory(prev => {
        // Check if this message already exists
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.type === 'project' && lastMessage?.output === projectMessage) {
          return prev;
        }
        return [...prev, { type: 'project', output: projectMessage }];
      });
    }
  }, [isOpen, projectMessage]);

  const handleCommand = async (message = currentCommand) => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setHistory(prev => [...prev, { type: 'user', command: userMessage }]);
    setCurrentCommand('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: userMessage
      });

      setHistory(prev => [...prev, { 
        type: 'assistant', 
        output: response.data.response 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Oops! Connection error. Try again!';
      
      // Check if it's a rate limit error
      if (error.response?.status === 429) {
        errorMessage = error.response?.data?.detail || 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      setHistory(prev => [...prev, { 
        type: 'error', 
        output: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl border border-cyan-500 animate-in fade-in slide-in-from-bottom-5 duration-300">
        {/* Terminal Header - Smaller on Mobile */}
        <div className="flex items-center justify-between gap-2 p-2 md:p-3 bg-zinc-900 text-xs text-gray-400 border-b border-cyan-500/30">
          <div className="flex gap-1 md:gap-1.5">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" onClick={onClose} />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
          </div>
          <div className="flex-1 text-center font-semibold font-['Space_Grotesk'] text-cyan-400 text-[10px] md:text-xs truncate">
            giacomo@ai-assistant:~$
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={14} className="md:w-4 md:h-4" />
          </button>
        </div>

        {/* Terminal Output - Smaller on Mobile, No ASCII Art */}
        <div 
          ref={terminalRef} 
          className="h-[70vh] md:h-[60vh] max-h-[500px] overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-3 bg-black cursor-text text-xs md:text-sm"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#00D9FF #1f2937'
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((entry, i) => (
            <div key={i} className="space-y-1 md:space-y-2">
              {entry.type === 'user' && (
                <div className="flex gap-1 md:gap-2 flex-wrap">
                  <span className="text-cyan-400 font-semibold whitespace-nowrap text-[10px] md:text-xs">visitor@terminal:~$</span>
                  <span className="text-white break-words text-[10px] md:text-xs">{entry.command}</span>
                </div>
              )}
              {entry.type === 'project' && (
                <div className="flex gap-1 md:gap-2 items-start">
                  <span className="text-green-400 font-semibold whitespace-nowrap text-[10px] md:text-xs">system@terminal:~$</span>
                  <span className="text-green-400 break-words text-[10px] md:text-xs">{entry.output}</span>
                </div>
              )}
              {(entry.type === 'assistant' || entry.type === 'system' || entry.type === 'error') && (
                <div className={`whitespace-pre-wrap leading-relaxed pl-3 md:pl-6 break-words text-[10px] md:text-xs ${
                  entry.type === 'system' ? 'text-cyan-400' : 
                  entry.type === 'error' ? 'text-red-400' : 
                  'text-gray-300'
                }`}>
                  {entry.output}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-1 md:gap-2 items-center pl-3 md:pl-6 text-cyan-400">
              <Loader2 size={12} className="md:w-4 md:h-4 animate-spin" />
              <span className="text-[10px] md:text-xs">Thinking...</span>
            </div>
          )}

          {/* Current Command Input */}
          <div className="flex gap-1 md:gap-2 items-start">
            <span className="text-cyan-400 font-semibold whitespace-nowrap pt-1 text-[10px] md:text-xs">visitor@terminal:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={e => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-white caret-cyan-400 disabled:opacity-50 min-w-0 text-[10px] md:text-xs"
              placeholder="Ask me anything..."
              spellCheck="false"
            />
            <span className="text-cyan-400 animate-pulse text-[10px] md:text-xs">█</span>
          </div>

          <div ref={bottomRef} />
        </div>
        
        {/* Terminal Footer - Smaller on Mobile */}
        <div className="bg-zinc-900 px-2 md:px-4 py-1.5 md:py-2 text-[9px] md:text-xs text-gray-500 border-t border-cyan-500/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 md:gap-2">
            <span className="text-center sm:text-left">Press Enter • OpenRouter AI</span>
            <span className="text-cyan-400">● ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTerminal;