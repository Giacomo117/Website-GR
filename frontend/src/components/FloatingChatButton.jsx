import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
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
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-cyan-500 hover:bg-cyan-400 text-black rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
          aria-label="Open AI Chat"
        >
          <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
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