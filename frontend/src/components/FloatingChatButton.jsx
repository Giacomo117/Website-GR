import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

const FloatingChatButton = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-400/60 hover:from-cyan-400 hover:to-cyan-500 border border-cyan-400/30"
          aria-label={t('chat.openButton')}
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
        prefillInput={prefillInput}
        onPrefillProcessed={() => setPrefillInput(null)}
      />
    </>
  );
};

export default FloatingChatButton;