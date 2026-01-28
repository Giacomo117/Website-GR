import React, { useState } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// Custom animated terminal icon
const TerminalIcon = ({ className }) => (
  <div className={`relative ${className}`}>
    {/* Terminal window */}
    <div className="w-8 h-6 md:w-10 md:h-8 bg-black/80 rounded-md border border-cyan-400/60 overflow-hidden flex flex-col">
      {/* Terminal header dots */}
      <div className="flex gap-0.5 px-1 py-0.5 bg-gray-800/80">
        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-red-400/80" />
        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-yellow-400/80" />
        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-400/80" />
      </div>
      {/* Terminal content with blinking cursor */}
      <div className="flex-1 flex items-center px-1">
        <span className="text-cyan-400 text-[6px] md:text-[8px] font-mono">{'>'}</span>
        <span className="w-1 h-2 md:w-1.5 md:h-3 bg-cyan-400 ml-0.5 animate-pulse" />
      </div>
    </div>
  </div>
);

// Alternative: AI Brain Icon with neural connections
const AIBrainIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={`${className} w-8 h-8 md:w-10 md:h-10`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {/* Brain outline */}
    <path 
      d="M12 4C8 4 5 7 5 10.5C5 12.5 6 14 7 15C7.5 15.5 8 16.5 8 18V20H16V18C16 16.5 16.5 15.5 17 15C18 14 19 12.5 19 10.5C19 7 16 4 12 4Z" 
      className="stroke-black"
    />
    {/* Neural connections - animated */}
    <circle cx="9" cy="9" r="1" className="fill-cyan-400 animate-pulse" />
    <circle cx="15" cy="9" r="1" className="fill-cyan-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
    <circle cx="12" cy="12" r="1" className="fill-cyan-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
    <line x1="9" y1="9" x2="12" y2="12" className="stroke-cyan-400/60" strokeWidth="0.5" />
    <line x1="15" y1="9" x2="12" y2="12" className="stroke-cyan-400/60" strokeWidth="0.5" />
    {/* Base */}
    <rect x="10" y="20" width="4" height="1" rx="0.5" className="fill-black" />
  </svg>
);

// Alternative: Animated chat bubble with typing dots
const TypingBubbleIcon = ({ className }) => (
  <div className={`relative ${className}`}>
    <div className="w-10 h-8 md:w-12 md:h-10 bg-black/80 rounded-2xl rounded-bl-sm border border-cyan-400/60 flex items-center justify-center gap-1 px-2">
      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const FloatingChatButton = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [projectMessage, setProjectMessage] = useState(null);
  const [projectContext, setProjectContext] = useState(null);
  const [autoSendMessage, setAutoSendMessage] = useState(null);
  const [prefillInput, setPrefillInput] = useState(null);
  const { t } = useLanguage();

  const handleOpen = (data = null) => {
    if (data && typeof data === 'object') {
      // If prefillInput is true, put text in input field without sending
      if (data.prefillInput) {
        setProjectMessage(null);
        setProjectContext(data.context);
        setAutoSendMessage(null);
        setPrefillInput(data.message);
      // If autoSend is true, don't show as hint - just send directly
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

  // Clear autoSend after it's been processed
  const handleAutoSendProcessed = () => {
    setAutoSendMessage(null);
  };

  // Expose handleOpen to parent
  React.useEffect(() => {
    if (onChatOpen) {
      onChatOpen(handleOpen);
    }
  }, [onChatOpen]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => handleOpen()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/70 hover:shadow-2xl hover:from-cyan-400 hover:to-cyan-500 border border-cyan-400/30 overflow-hidden"
          aria-label={t('chat.openButton')}
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* The terminal icon - switches to typing animation on hover */}
          <div className="relative z-10 transition-all duration-300">
            {isHovered ? (
              <TypingBubbleIcon className="transform scale-100" />
            ) : (
              <TerminalIcon className="transform scale-100" />
            )}
          </div>
          
          {/* Rotating border effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-clip-border animate-spin-slow" style={{ animationDuration: '3s' }} />
          </div>
          
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-2xl bg-cyan-400/20 animate-ping opacity-50" style={{ animationDuration: '2s' }} />
          
          {/* Corner accent */}
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
        </button>
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
    </>
  );
};

export default FloatingChatButton;