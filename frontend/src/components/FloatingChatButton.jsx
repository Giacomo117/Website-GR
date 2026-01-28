import React, { useState, useEffect, useRef } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// Stylized 3D Avatar of Giacomo - Based on real photo
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
      {/* 3D shadow */}
      <div className="absolute inset-0 rounded-full bg-gray-900/40 transform translate-x-0.5 translate-y-0.5 blur-[1px]" />
      
      {/* Head - viso allungato */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: '42% 42% 45% 45%',
          background: 'linear-gradient(180deg, #d4a574 0%, #c9956a 40%, #b8845c 100%)'
        }}
      >
        {/* Shading viso */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
        
        {/* CAPELLI - mossi e voluminosi, spettinati in alto */}
        <div className="absolute -top-2 -left-1 -right-1">
          {/* Base capelli */}
          <div 
            className="relative w-full h-8"
            style={{
              background: 'linear-gradient(180deg, #4a3728 0%, #3d2d1f 50%, #2d1f14 100%)',
              borderRadius: '60% 60% 20% 20%'
            }}
          />
          {/* Ciuffi spettinati in alto - stile messy */}
          <div 
            className="absolute -top-1 left-2 w-2 h-3 rotate-[-20deg]"
            style={{ background: 'linear-gradient(180deg, #4a3728, #3d2d1f)', borderRadius: '50% 50% 40% 40%' }}
          />
          <div 
            className="absolute -top-1.5 left-4 w-1.5 h-3.5 rotate-[-10deg]"
            style={{ background: 'linear-gradient(180deg, #5a4738, #3d2d1f)', borderRadius: '50% 50% 40% 40%' }}
          />
          <div 
            className="absolute -top-2 left-6 w-2 h-4 rotate-[5deg]"
            style={{ background: 'linear-gradient(180deg, #4a3728, #2d1f14)', borderRadius: '50% 50% 40% 40%' }}
          />
          <div 
            className="absolute -top-1.5 right-4 w-2 h-3.5 rotate-[15deg]"
            style={{ background: 'linear-gradient(180deg, #5a4738, #3d2d1f)', borderRadius: '50% 50% 40% 40%' }}
          />
          <div 
            className="absolute -top-1 right-2 w-1.5 h-3 rotate-[25deg]"
            style={{ background: 'linear-gradient(180deg, #4a3728, #3d2d1f)', borderRadius: '50% 50% 40% 40%' }}
          />
          {/* Ciuffi laterali */}
          <div 
            className="absolute top-3 -left-1 w-2.5 h-4"
            style={{ background: 'linear-gradient(90deg, #3d2d1f, transparent)', borderRadius: '40%' }}
          />
          <div 
            className="absolute top-3 -right-1 w-2.5 h-4"
            style={{ background: 'linear-gradient(-90deg, #3d2d1f, transparent)', borderRadius: '40%' }}
          />
        </div>

        {/* SOPRACCIGLIA - spesse e scure */}
        <div 
          className="absolute top-5 left-2 w-3 h-1 rounded-sm transform -rotate-2"
          style={{ background: 'linear-gradient(90deg, #2d1f14 20%, #3d2d1f 80%, transparent)' }}
        />
        <div 
          className="absolute top-5 right-2 w-3 h-1 rounded-sm transform rotate-2"
          style={{ background: 'linear-gradient(-90deg, #2d1f14 20%, #3d2d1f 80%, transparent)' }}
        />

        {/* OCCHI - marroni/nocciola, forma naturale */}
        <div className="absolute top-6 left-0 right-0 flex justify-center gap-2.5">
          {/* Left eye */}
          <div className="relative w-3 h-2.5 md:w-3.5 md:h-3">
            {eyesClosed ? (
              <div 
                className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-900/80 rounded-full"
                style={{ transform: 'translateY(-50%)' }}
              />
            ) : (
              <>
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 shadow-inner"
                  style={{ borderRadius: '45% 45% 50% 50%' }}
                />
                <div 
                  className="absolute w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-transform duration-75"
                  style={{ 
                    background: 'radial-gradient(circle at 35% 35%, #8B7355 0%, #6B5344 40%, #4a3728 100%)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/90 rounded-full" />
                </div>
              </>
            )}
          </div>
          
          {/* Right eye */}
          <div className="relative w-3 h-2.5 md:w-3.5 md:h-3">
            {eyesClosed ? (
              <div 
                className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-900/80 rounded-full"
                style={{ transform: 'translateY(-50%)' }}
              />
            ) : (
              <>
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 shadow-inner"
                  style={{ borderRadius: '45% 45% 50% 50%' }}
                />
                <div 
                  className="absolute w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-transform duration-75"
                  style={{ 
                    background: 'radial-gradient(circle at 35% 35%, #8B7355 0%, #6B5344 40%, #4a3728 100%)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(calc(-50% + ${eyeOffset.x}px), calc(-50% + ${eyeOffset.y}px))`
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-900 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/90 rounded-full" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* NASO - più pronunciato */}
        <div className="absolute top-7.5 left-1/2 -translate-x-1/2 w-2 h-2.5">
          <div 
            className="w-full h-full"
            style={{ 
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)',
              borderRadius: '30% 30% 50% 50%'
            }}
          />
        </div>

        {/* BARBA/PIZZETTO - leggero, stile 3 giorni */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-5"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(45,31,20,0.25) 0%, rgba(45,31,20,0.15) 40%, transparent 70%)',
          }}
        />
        {/* Pizzetto sotto il labbro */}
        <div 
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-2"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(45,31,20,0.3) 0%, transparent 70%)',
          }}
        />
        {/* Baffi leggeri */}
        <div 
          className="absolute bottom-3.5 left-1/2 -translate-x-1/2 w-4 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(45,31,20,0.15) 30%, rgba(45,31,20,0.15) 70%, transparent)',
          }}
        />

        {/* BOCCA */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          {isHovered ? (
            <div className="w-4 h-1.5 overflow-hidden">
              <div 
                className="w-4 h-3 rounded-b-full"
                style={{ 
                  background: 'linear-gradient(180deg, #b07060 0%, #a06050 100%)',
                  borderBottom: '1px solid rgba(0,0,0,0.2)'
                }}
              />
            </div>
          ) : (
            <div className="w-3.5 h-1 overflow-hidden">
              <div 
                className="w-full h-2 rounded-b-full border-b border-amber-900/40"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(176,112,96,0.3))' }}
              />
            </div>
          )}
        </div>

        {/* Orecchie */}
        <div 
          className="absolute top-6 -left-0.5 w-1.5 h-2.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #b8845c, #c9956a)' }}
        />
        <div 
          className="absolute top-6 -right-0.5 w-1.5 h-2.5 rounded-full"
          style={{ background: 'linear-gradient(-90deg, #b8845c, #c9956a)' }}
        />
      </div>

      {/* Collar hint - camicia scura */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 overflow-hidden"
        style={{ borderRadius: '0 0 50% 50%' }}
      >
        <div 
          className="w-full h-full"
          style={{ background: 'linear-gradient(180deg, #374151 0%, #1f2937 100%)' }}
        />
        {/* V-neck opening */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2"
          style={{ 
            background: 'linear-gradient(180deg, #c9956a 0%, #b8845c 100%)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
          }}
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