import React, { useState, useEffect, useRef } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// Mini Terminal Icon - Coerente con la chat
const TerminalIcon = ({ isHovered }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Terminal window */}
      <div 
        className={`relative w-12 h-10 md:w-14 md:h-11 lg:w-16 lg:h-12 rounded-md overflow-hidden transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
          border: '1px solid rgba(34,211,238,0.4)',
          boxShadow: isHovered 
            ? '0 0 20px rgba(6,182,212,0.4), inset 0 0 15px rgba(6,182,212,0.1)' 
            : '0 0 10px rgba(6,182,212,0.2), inset 0 0 10px rgba(6,182,212,0.05)'
        }}
      >
        {/* Title bar */}
        <div className="absolute top-0 left-0 right-0 h-2.5 md:h-3 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center px-1.5 gap-0.5">
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-red-500" />
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-yellow-500" />
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500" />
        </div>
        
        {/* Terminal content */}
        <div className="absolute top-3 md:top-3.5 left-1.5 right-1.5 bottom-1">
          {/* Prompt line with typing animation */}
          <div className="flex items-center gap-0.5">
            <span className="text-green-400 text-[6px] md:text-[7px] lg:text-[8px] font-mono">$</span>
            <span className="text-cyan-400 text-[6px] md:text-[7px] lg:text-[8px] font-mono">_</span>
            <div 
              className="w-0.5 h-2 md:h-2.5 bg-cyan-400 ml-0.5"
              style={{ animation: 'cursorBlink 1s step-end infinite' }}
            />
          </div>
          
          {/* Fake code lines */}
          <div className="mt-0.5 space-y-0.5">
            <div 
              className="h-0.5 rounded-full"
              style={{ 
                width: '70%',
                background: 'linear-gradient(90deg, rgba(34,211,238,0.5), transparent)',
                animation: 'lineSlide 2s ease-in-out infinite'
              }}
            />
            <div 
              className="h-0.5 rounded-full"
              style={{ 
                width: '50%',
                background: 'linear-gradient(90deg, rgba(74,222,128,0.4), transparent)',
                animation: 'lineSlide 2s ease-in-out infinite 0.3s'
              }}
            />
            <div 
              className="h-0.5 rounded-full"
              style={{ 
                width: '85%',
                background: 'linear-gradient(90deg, rgba(168,85,247,0.4), transparent)',
                animation: 'lineSlide 2s ease-in-out infinite 0.6s'
              }}
            />
          </div>
        </div>

        {/* Scan line effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
          }}
        />
        
        {/* Glow effect on hover */}
        {isHovered && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(6,182,212,0.15) 0%, transparent 70%)'
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes lineSlide {
          0%, 100% { opacity: 0.5; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
};

const FloatingChatButton = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [projectMessage, setProjectMessage] = useState(null);
  const [projectContext, setProjectContext] = useState(null);
  const [autoSendMessage, setAutoSendMessage] = useState(null);
  const [prefillInput, setPrefillInput] = useState(null);
  const { t } = useLanguage();
  const buttonRef = useRef(null);

  const handleOpen = (data = null) => {
    if (data && typeof data === 'object') {
      if (data.prefillInput) {
        setProjectMessage(null);
        setProjectContext(data.context);
        setAutoSendMessage(null);
        setPrefillInput(data.message);
      } else if (data.autoSend) {
        setProjectMessage(null);
        setProjectContext(data.context);
        setAutoSendMessage(data.message);
        setPrefillInput(null);
      } else {
        setProjectMessage(data.message);
        setProjectContext(data.context);
        setAutoSendMessage(null);
        setPrefillInput(null);
      }
    } else {
      setProjectMessage(data);
      setProjectContext(null);
      setAutoSendMessage(null);
      setPrefillInput(null);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setProjectMessage(null);
    setProjectContext(null);
    setAutoSendMessage(null);
    setPrefillInput(null);
  };

  const handleAutoSendProcessed = () => {
    setAutoSendMessage(null);
  };

  React.useEffect(() => {
    if (onChatOpen) {
      onChatOpen(handleOpen);
    }
  }, [onChatOpen]);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-2">
          {/* Label sempre visibile */}
          <div className="bg-gray-900/95 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-cyan-500/30 backdrop-blur-sm">
            <span className="text-cyan-400">Chat</span> with Giacomo
          </div>
          
          <button
            ref={buttonRef}
            onClick={() => handleOpen()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`rounded-xl flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
            style={{
              width: 'clamp(64px, 9vw, 80px)',
              height: 'clamp(52px, 7vw, 64px)',
              background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
              boxShadow: isHovered 
                ? '0 0 30px rgba(6,182,212,0.4), 0 0 60px rgba(6,182,212,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' 
                : '0 8px 25px rgba(0,0,0,0.5), 0 0 20px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
              border: '1px solid rgba(34,211,238,0.3)',
            }}
            aria-label={t('chat.openButton')}
          >
            <TerminalIcon isHovered={isHovered} />
            
            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-50" />
              <div className="absolute inset-0.5 bg-green-500 rounded-full border border-gray-900" />
            </div>
          </button>
        </div>
      )}

      <ChatTerminal 
        isOpen={isOpen} 
        onClose={handleClose}
        projectMessage={projectMessage}
        projectContext={projectContext}
        autoSendMessage={autoSendMessage}
        onAutoSendProcessed={handleAutoSendProcessed}
        prefillInput={prefillInput}
        onPrefillProcessed={() => setPrefillInput(null)}
      />
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default FloatingChatButton;