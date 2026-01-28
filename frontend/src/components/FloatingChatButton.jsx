import React, { useState, useEffect, useRef } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// Stylized 3D Avatar of Giacomo - European/Italian style
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
      {/* 3D effect shadow */}
      <div className="absolute inset-0 rounded-full bg-gray-800 transform translate-x-0.5 translate-y-0.5 opacity-40" />
      
      {/* Head - più ovale, meno tondo, skin italiana */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '45% 45% 42% 42%',
          background: 'linear-gradient(180deg, #e8c4a0 0%, #ddb892 50%, #d4a574 100%)'
        }}
      >
        {/* Face shading */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* Hair - capelli castano scuro, più voluminosi e mossi */}
        <div className="absolute -top-1 -left-0.5 -right-0.5">
          {/* Volume principale */}
          <div 
            className="w-full h-6 md:h-7"
            style={{
              background: 'linear-gradient(180deg, #2d1f14 0%, #3d2914 40%, #2d1f14 100%)',
              borderRadius: '50% 50% 20% 20%'
            }}
          />
          {/* Ciuffo laterale sinistro */}
          <div 
            className="absolute top-2 -left-0.5 w-3 h-4"
            style={{
              background: 'linear-gradient(135deg, #2d1f14 0%, #3d2914 100%)',
              borderRadius: '40%'
            }}
          />
          {/* Ciuffo laterale destro */}
          <div 
            className="absolute top-2 -right-0.5 w-3 h-4"
            style={{
              background: 'linear-gradient(-135deg, #2d1f14 0%, #3d2914 100%)',
              borderRadius: '40%'
            }}
          />
          {/* Highlights capelli */}
          <div className="absolute top-1 left-3 w-4 h-2 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent rounded-full" />
        </div>

        {/* Sopracciglia - più marcate, stile italiano */}
        <div className="absolute top-5 left-2.5 w-2.5 h-0.5 bg-gradient-to-r from-transparent via-amber-900 to-amber-900/50 rounded-full transform -rotate-3" />
        <div className="absolute top-5 right-2.5 w-2.5 h-0.5 bg-gradient-to-l from-transparent via-amber-900 to-amber-900/50 rounded-full transform rotate-3" />

        {/* Eyes container - posizionati più in alto */}
        <div className="absolute top-6 left-0 right-0 flex justify-center gap-3">
          {/* Left eye */}
          <div className="relative w-2.5 h-3 md:w-3 md:h-3.5">
            {eyesClosed ? (
              <div 
                className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-900 rounded-full transform -translate-y-1/2"
                style={{ transform: 'translateY(-50%) scaleY(0.5)' }}
              />
            ) : (
              <>
                {/* Eye white - più allungato orizzontalmente */}
                <div 
                  className="absolute inset-0 bg-white shadow-inner"
                  style={{ borderRadius: '40% 40% 45% 45%' }}
                />
                {/* Iris - occhi marroni/nocciola */}
                <div 
                  className="absolute w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-transform duration-75"
                  style={{ 
                    background: 'radial-gradient(circle at 30% 30%, #8B5A2B, #5D4037, #3E2723)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                  }}
                >
                  {/* Pupil */}
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  {/* Eye shine */}
                  <div className="absolute top-0.5 left-1 w-0.5 h-0.5 bg-white rounded-full" />
                </div>
              </>
            )}
          </div>
          
          {/* Right eye */}
          <div className="relative w-2.5 h-3 md:w-3 md:h-3.5">
            {eyesClosed ? (
              <div 
                className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-900 rounded-full transform -translate-y-1/2"
                style={{ transform: 'translateY(-50%) scaleY(0.5)' }}
              />
            ) : (
              <>
                <div 
                  className="absolute inset-0 bg-white shadow-inner"
                  style={{ borderRadius: '40% 40% 45% 45%' }}
                />
                <div 
                  className="absolute w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-transform duration-75"
                  style={{ 
                    background: 'radial-gradient(circle at 30% 30%, #8B5A2B, #5D4037, #3E2723)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-0.5 left-1 w-0.5 h-0.5 bg-white rounded-full" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Nose - naso più definito, stile mediterraneo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-1.5 h-2">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-amber-800/20 rounded-b-full" />
        </div>

        {/* Mouth */}
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2">
          {isHovered ? (
            // Big smile
            <div className="w-4 h-2 overflow-hidden">
              <div 
                className="w-4 h-4 border-2 border-gray-700 rounded-full"
                style={{ 
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  background: 'linear-gradient(180deg, transparent 40%, #c9a080 100%)'
                }}
              />
            </div>
          ) : (
            // Slight smile
            <div className="w-3 h-1.5 overflow-hidden">
              <div className="w-3 h-3 border-b-2 border-amber-800/60 rounded-full" />
            </div>
          )}
        </div>

        {/* Stubble/beard shadow - barba leggera */}
        <div 
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, #2d1f14 0%, transparent 70%)'
          }}
        />

        {/* Ears */}
        <div 
          className="absolute top-6 -left-1 w-1.5 h-3 rounded-full"
          style={{ background: 'linear-gradient(90deg, #c9a080, #ddb892)' }}
        />
        <div 
          className="absolute top-6 -right-1 w-1.5 h-3 rounded-full"
          style={{ background: 'linear-gradient(-90deg, #c9a080, #ddb892)' }}
        />
      </div>
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