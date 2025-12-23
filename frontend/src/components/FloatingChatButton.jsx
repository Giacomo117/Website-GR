import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatTerminal from './ChatTerminal';

const FloatingChatButton = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectMessage, setProjectMessage] = useState(null);
  const [projectContext, setProjectContext] = useState(null);
  const [autoSendMessage, setAutoSendMessage] = useState(null);

  const handleOpen = (data = null) => {
    if (data && typeof data === 'object') {
      setProjectMessage(data.message);
      setProjectContext(data.context);
      // If autoSend is true, we'll send this message automatically
      if (data.autoSend) {
        setAutoSendMessage(data.message);
      } else {
        setAutoSendMessage(null);
      }
    } else {
      setProjectMessage(data);
      setProjectContext(null);
      setAutoSendMessage(null);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setProjectMessage(null);
    setProjectContext(null);
    setAutoSendMessage(null);
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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/60 hover:from-cyan-400 hover:to-cyan-500 border border-cyan-400/30"
          aria-label="Open AI Chat"
        >
          <MessageSquare 
            size={28} 
            className="text-black md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300" 
          />
          
          {/* Pulse ring animation */}
          <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping opacity-75" />
        </button>
      )}

      <ChatTerminal 
        isOpen={isOpen} 
        onClose={handleClose}
        projectMessage={projectMessage}
        projectContext={projectContext}
        autoSendMessage={autoSendMessage}
        onAutoSendProcessed={handleAutoSendProcessed}
      />
    </>
  );
};

export default FloatingChatButton;