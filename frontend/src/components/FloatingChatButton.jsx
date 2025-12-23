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
          className="fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 group overflow-hidden"
          aria-label="Open AI Chat"
        >
          <VoicePoweredOrb 
            hue={180}
            enableVoiceControl={false}
            className="w-full h-full"
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