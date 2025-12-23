import React, { useState } from 'react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';
import ChatTerminal from './ChatTerminal';

const FloatingChatButton = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectMessage, setProjectMessage] = useState(null);

  const handleOpen = (message = null) => {
    setProjectMessage(message);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setProjectMessage(null);
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
          className="fixed bottom-4 right-4 md:bottom-6 md:right-10 z-50 w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 group overflow-hidden shadow-2xl shadow-cyan-500/40"
          aria-label="Open AI Chat"
        >
          <VoicePoweredOrb 
            hue={180}
            enableVoiceControl={false}
            className="w-full h-full scale-125"
          />
        </button>
      )}

      <ChatTerminal 
        isOpen={isOpen} 
        onClose={handleClose}
        projectMessage={projectMessage}
      />
    </>
  );
};

export default FloatingChatButton;