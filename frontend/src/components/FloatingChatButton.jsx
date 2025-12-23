import React, { useState, useEffect } from 'react';
import { VoicePoweredOrb } from './ui/voice-powered-orb';
import ChatTerminal from './ChatTerminal';

const FloatingChatButton = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectMessage, setProjectMessage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleOpen = (message = null) => {
    setProjectMessage(message);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setProjectMessage(null);
  };

  // Expose handleOpen to parent
  useEffect(() => {
    if (onChatOpen) {
      onChatOpen(handleOpen);
    }
  }, [onChatOpen]);

  // Handle scroll and mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    checkMobile();
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const buttonSize = isMobile && isScrolled 
    ? 'w-16 h-16' 
    : 'w-28 h-28 md:w-32 md:h-32';

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => handleOpen()}
          className={`fixed bottom-6 right-8 z-50 ${buttonSize} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden shadow-2xl shadow-cyan-500/40`}
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