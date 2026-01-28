import React, { useState, useEffect, useRef } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// 3D Orbiting Particles Icon - Enhanced
const OrbitingParticles = ({ isHovered }) => {
  return (
    <div className="relative w-14 h-14 md:w-16 md:h-16">
      {/* Outer glow aura */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 60%)',
          filter: 'blur(8px)',
          transform: 'scale(1.3)'
        }}
      />

      {/* Central glowing core with energy field */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Energy field rings */}
        <div 
          className="absolute -inset-3 rounded-full opacity-30"
          style={{
            border: '1px solid #22d3ee',
            animation: 'energyPulse 2s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute -inset-5 rounded-full opacity-20"
          style={{
            border: '1px solid #06b6d4',
            animation: 'energyPulse 2s ease-in-out infinite 0.5s'
          }}
        />
        
        {/* Main core */}
        <div 
          className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${isHovered ? 'scale-130' : 'scale-100'}`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #67e8f9 20%, #06b6d4 60%, #0891b2 100%)',
            boxShadow: isHovered 
              ? '0 0 25px #22d3ee, 0 0 50px #06b6d4, 0 0 80px rgba(6,182,212,0.6), inset 0 0 10px rgba(255,255,255,0.5)' 
              : '0 0 20px #06b6d4, 0 0 40px rgba(6,182,212,0.5), inset 0 0 8px rgba(255,255,255,0.3)'
          }}
        />
        {/* Inner bright spot */}
        <div 
          className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/80 blur-[1px]"
        />
      </div>

      {/* Orbit Ring 1 - Main horizontal */}
      <div 
        className="absolute inset-0.5 rounded-full"
        style={{
          border: '1.5px solid rgba(34,211,238,0.4)',
          animation: 'orbit1 8s linear infinite',
          boxShadow: '0 0 10px rgba(34,211,238,0.2)'
        }}
      >
        {/* Comet particle with trail */}
        <div 
          className="absolute w-3 h-3 rounded-full"
          style={{ 
            top: '-6px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #67e8f9, #06b6d4)',
            boxShadow: '0 0 15px #22d3ee, 0 0 30px rgba(34,211,238,0.5)',
          }}
        />
        {/* Trail */}
        <div 
          className="absolute w-6 h-1.5 rounded-full"
          style={{ 
            top: '-3px', 
            left: 'calc(50% + 6px)', 
            background: 'linear-gradient(90deg, rgba(34,211,238,0.6), transparent)',
            filter: 'blur(2px)'
          }}
        />
      </div>

      {/* Orbit Ring 2 - Tilted with glow */}
      <div 
        className="absolute inset-2 rounded-full"
        style={{
          border: '1px solid rgba(59,130,246,0.3)',
          animation: 'orbit2 6s linear infinite reverse',
          boxShadow: '0 0 8px rgba(59,130,246,0.15)'
        }}
      >
        <div 
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            top: '50%', 
            right: '-4px', 
            transform: 'translateY(-50%)',
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #93c5fd, #3b82f6)',
            boxShadow: '0 0 12px #60a5fa'
          }}
        />
      </div>

      {/* Orbit Ring 3 - Outer vertical */}
      <div 
        className="absolute -inset-0.5 rounded-full"
        style={{
          border: '1px solid rgba(168,85,247,0.25)',
          animation: 'orbit3 12s linear infinite',
          boxShadow: '0 0 6px rgba(168,85,247,0.1)'
        }}
      >
        <div 
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{ 
            top: '50%', 
            left: '-5px', 
            transform: 'translateY(-50%)',
            background: 'radial-gradient(circle at 30% 30%, #ffffff, #c4b5fd, #a855f7)',
            boxShadow: '0 0 15px rgba(168,85,247,0.6)'
          }}
        />
      </div>

      {/* Sparkle particles */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full"
          style={{ 
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            top: `${15 + i * 12}%`,
            left: `${10 + (i % 3) * 30}%`,
            background: i % 2 === 0 ? '#22d3ee' : '#a855f7',
            boxShadow: `0 0 ${4 + i * 2}px ${i % 2 === 0 ? '#22d3ee' : '#a855f7'}`,
            animation: `sparkle ${2 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
            opacity: 0.8
          }}
        />
      ))}

      {/* Lightning/energy lines on hover */}
      {isHovered && (
        <>
          <div 
            className="absolute top-1/2 left-1/2 w-8 h-0.5 -translate-x-1/2 -translate-y-1/2 rotate-45"
            style={{
              background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
              animation: 'lightning 0.5s ease-out',
              filter: 'blur(1px)'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-8 h-0.5 -translate-x-1/2 -translate-y-1/2 -rotate-45"
            style={{
              background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
              animation: 'lightning 0.5s ease-out 0.1s',
              filter: 'blur(1px)'
            }}
          />
        </>
      )}

      <style>{`
        @keyframes orbit1 {
          from { transform: rotateX(70deg) rotateZ(0deg); }
          to { transform: rotateX(70deg) rotateZ(360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotateX(60deg) rotateY(60deg) rotateZ(0deg); }
          to { transform: rotateX(60deg) rotateY(60deg) rotateZ(360deg); }
        }
        @keyframes orbit3 {
          from { transform: rotateX(80deg) rotateY(-30deg) rotateZ(0deg); }
          to { transform: rotateX(80deg) rotateY(-30deg) rotateZ(360deg); }
        }
        @keyframes sparkle {
          0%, 100% { transform: scale(0.5); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes energyPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }
        @keyframes lightning {
          0% { opacity: 0; transform: translate(-50%, -50%) scaleX(0); }
          50% { opacity: 1; transform: translate(-50%, -50%) scaleX(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scaleX(0); }
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
          className={`fixed bottom-6 right-6 z-50 rounded-full flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          style={{
            width: '72px',
            height: '72px',
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)',
            boxShadow: isHovered 
              ? '0 0 40px rgba(6,182,212,0.5), 0 0 80px rgba(6,182,212,0.3), inset 0 0 30px rgba(6,182,212,0.1)' 
              : '0 0 25px rgba(6,182,212,0.3), 0 0 50px rgba(6,182,212,0.15)',
            border: '1px solid rgba(6,182,212,0.3)',
            animation: 'buttonFloat 4s ease-in-out infinite'
          }}
          aria-label={t('chat.openButton')}
        >
          <OrbitingParticles isHovered={isHovered} />
          
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-50" />
            <div className="absolute inset-0.5 bg-green-500 rounded-full border border-black" />
          </div>

          {/* Tooltip on hover - positioned to not overflow */}
          {isHovered && (
            <div className="absolute -top-12 right-0 bg-gray-900/95 text-white text-xs px-4 py-2 rounded-lg whitespace-nowrap shadow-xl border border-cyan-500/30 backdrop-blur-sm animate-fade-in">
              <span className="text-cyan-400">Chat</span> with Giacomo
              <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-gray-900/95 rotate-45 border-r border-b border-cyan-500/30" />
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
        @keyframes buttonFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
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