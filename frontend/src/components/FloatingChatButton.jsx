import React, { useState, useEffect, useRef } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// Stylized 3D Avatar of Giacomo
const GiacomoAvatar = ({ isHovered, mousePosition, buttonRef }) => {
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Eye tracking based on mouse position
  useEffect(() => {
    if (isHovered || !buttonRef.current) {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e) => {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / 100;
      const deltaY = (e.clientY - centerY) / 100;
      
      // Limit eye movement
      const maxOffset = 2;
      setEyeOffset({
        x: Math.max(-maxOffset, Math.min(maxOffset, deltaX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, deltaY))
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered, buttonRef]);

  // Random blinking
  useEffect(() => {
    if (isHovered) return;
    
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, [isHovered]);

  const eyesClosed = isHovered || isBlinking;

  return (
    <div className="relative w-12 h-12 md:w-14 md:h-14">
      {/* 3D effect shadow layers */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 transform translate-x-1 translate-y-1 opacity-50" />
      
      {/* Head base with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 shadow-inner overflow-hidden">
        
        {/* Subtle face shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-300/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Hair - dark, styled */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-11 md:w-12">
          <div className="relative">
            {/* Main hair volume */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 md:w-11 md:h-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-t-full" />
            {/* Hair texture/waves */}
            <div className="absolute top-1 left-2 w-2 h-3 bg-gray-700/50 rounded-full rotate-12" />
            <div className="absolute top-0.5 right-2 w-2 h-3 bg-gray-700/50 rounded-full -rotate-12" />
            {/* Side hair */}
            <div className="absolute top-3 -left-0.5 w-2 h-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-full" />
            <div className="absolute top-3 -right-0.5 w-2 h-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-full" />
          </div>
        </div>

        {/* Face features container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          
          {/* Eyes container */}
          <div className="flex gap-2.5 md:gap-3 mb-1">
            {/* Left eye */}
            <div className="relative w-2.5 h-2.5 md:w-3 md:h-3">
              {eyesClosed ? (
                // Closed eye - happy squint
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-800 rounded-full transform -translate-y-1/2" 
                     style={{ 
                       borderRadius: '0 0 50% 50%',
                       height: '2px'
                     }} 
                />
              ) : (
                <>
                  {/* Eye white */}
                  <div className="absolute inset-0 bg-white rounded-full shadow-inner" />
                  {/* Iris */}
                  <div 
                    className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full transition-transform duration-100"
                    style={{ 
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                    }}
                  >
                    {/* Pupil */}
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    {/* Eye shine */}
                    <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
                  </div>
                </>
              )}
            </div>
            
            {/* Right eye */}
            <div className="relative w-2.5 h-2.5 md:w-3 md:h-3">
              {eyesClosed ? (
                // Closed eye - happy squint
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-800 rounded-full transform -translate-y-1/2"
                     style={{ 
                       borderRadius: '0 0 50% 50%',
                       height: '2px'
                     }}
                />
              ) : (
                <>
                  {/* Eye white */}
                  <div className="absolute inset-0 bg-white rounded-full shadow-inner" />
                  {/* Iris */}
                  <div 
                    className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full transition-transform duration-100"
                    style={{ 
                      top: '50%',
                      left: '50%',
                      transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                    }}
                  >
                    {/* Pupil */}
                    <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    {/* Eye shine */}
                    <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Nose - subtle */}
          <div className="w-1 h-1.5 bg-gradient-to-b from-transparent to-amber-300/50 rounded-full mb-0.5" />

          {/* Mouth */}
          <div className={`transition-all duration-200 ${isHovered ? 'w-4 h-1.5' : 'w-3 h-0.5'}`}>
            {isHovered ? (
              // Smile when hovered
              <div className="w-full h-full bg-gray-800 rounded-b-full" />
            ) : (
              // Slight smile normally
              <div className="w-full h-full border-b-2 border-gray-700 rounded-b-full" />
            )}
          </div>
        </div>

        {/* Cheek blush on hover */}
        {isHovered && (
          <>
            <div className="absolute bottom-3 left-1.5 w-2 h-1 bg-pink-300/40 rounded-full blur-[1px]" />
            <div className="absolute bottom-3 right-1.5 w-2 h-1 bg-pink-300/40 rounded-full blur-[1px]" />
          </>
        )}

        {/* Subtle ear hints */}
        <div className="absolute top-1/2 -left-0.5 w-1.5 h-2.5 bg-gradient-to-r from-amber-300 to-amber-200 rounded-full -translate-y-1/2" />
        <div className="absolute top-1/2 -right-0.5 w-1.5 h-2.5 bg-gradient-to-l from-amber-300 to-amber-200 rounded-full -translate-y-1/2" />
      </div>

      {/* Floating animation container */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
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
        <button
          ref={buttonRef}
          onClick={() => handleOpen()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 z-50 p-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          style={{
            background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
            boxShadow: isHovered 
              ? '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(255,255,255,0.1)' 
              : '0 8px 32px rgba(6, 182, 212, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.2)',
            animation: 'float 3s ease-in-out infinite'
          }}
          aria-label={t('chat.openButton')}
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping opacity-30" style={{ animationDuration: '2s' }} />
          
          {/* The Avatar */}
          <GiacomoAvatar isHovered={isHovered} buttonRef={buttonRef} />
          
          {/* Online indicator */}
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse" />
            <div className="absolute inset-0.5 bg-green-500 rounded-full" />
          </div>

          {/* Chat bubble hint on hover */}
          {isHovered && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg border border-cyan-500/30 animate-fade-in">
              Chat with me!
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45 border-r border-b border-cyan-500/30" />
            </div>
          )}
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
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 5px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default FloatingChatButton;