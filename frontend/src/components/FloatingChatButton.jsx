import React, { useState, useEffect, useRef } from 'react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

// 3D Orbiting Particles Icon
const OrbitingParticles = ({ isHovered }) => {
  return (
    <div className="relative w-14 h-14 md:w-16 md:h-16">
      {/* Central glowing core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div 
          className={`w-5 h-5 md:w-6 md:h-6 rounded-full transition-all duration-300 ${isHovered ? 'scale-125' : 'scale-100'}`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, #67e8f9, #06b6d4, #0891b2)',
            boxShadow: isHovered 
              ? '0 0 20px #06b6d4, 0 0 40px #06b6d4, 0 0 60px rgba(6,182,212,0.5)' 
              : '0 0 15px #06b6d4, 0 0 30px rgba(6,182,212,0.4)'
          }}
        />
        {/* Inner glow pulse */}
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: '#22d3ee', animationDuration: '2s' }}
        />
      </div>

      {/* Orbit Ring 1 - Horizontal */}
      <div 
        className="absolute inset-1 rounded-full border border-cyan-400/30"
        style={{
          animation: 'spin 8s linear infinite',
          transform: 'rotateX(60deg)'
        }}
      >
        {/* Particle on orbit 1 */}
        <div 
          className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50"
          style={{ top: '-4px', left: '50%', transform: 'translateX(-50%)' }}
        />
        <div 
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300"
          style={{ bottom: '-3px', left: '50%', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Orbit Ring 2 - Tilted */}
      <div 
        className="absolute inset-2 rounded-full border border-cyan-500/20"
        style={{
          animation: 'spin 6s linear infinite reverse',
          transform: 'rotateX(60deg) rotateY(45deg)'
        }}
      >
        {/* Particle on orbit 2 */}
        <div 
          className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
          style={{ top: '50%', right: '-3px', transform: 'translateY(-50%)' }}
        />
      </div>

      {/* Orbit Ring 3 - Vertical feel */}
      <div 
        className="absolute inset-0 rounded-full border border-cyan-400/20"
        style={{
          animation: 'spin 10s linear infinite',
          transform: 'rotateX(75deg) rotateZ(30deg)'
        }}
      >
        {/* Particles on orbit 3 */}
        <div 
          className="absolute w-2.5 h-2.5 rounded-full shadow-lg"
          style={{ 
            top: '50%', 
            left: '-5px', 
            transform: 'translateY(-50%)',
            background: 'radial-gradient(circle at 30% 30%, #a5f3fc, #22d3ee)',
            boxShadow: '0 0 10px #22d3ee'
          }}
        />
        <div 
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ top: '50%', right: '-2px', transform: 'translateY(-50%)' }}
        />
      </div>

      {/* Floating micro particles */}
      <div 
        className="absolute w-1 h-1 rounded-full bg-cyan-300/80"
        style={{ 
          top: '20%', 
          right: '15%',
          animation: 'float 3s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute w-0.5 h-0.5 rounded-full bg-white/60"
        style={{ 
          bottom: '25%', 
          left: '20%',
          animation: 'float 2.5s ease-in-out infinite 0.5s'
        }}
      />
      <div 
        className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/40"
        style={{ 
          top: '30%', 
          left: '10%',
          animation: 'float 4s ease-in-out infinite 1s'
        }}
      />

      {/* Extra glow effect on hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)'
          }}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotateX(60deg) rotateZ(0deg); }
          to { transform: rotateX(60deg) rotateZ(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-3px) scale(1.2); opacity: 1; }
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

          {/* Tooltip on hover */}
          {isHovered && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-xs px-4 py-2 rounded-lg whitespace-nowrap shadow-xl border border-cyan-500/30 backdrop-blur-sm animate-fade-in">
              <span className="text-cyan-400">Chat</span> with Giacomo
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900/95 rotate-45 border-r border-b border-cyan-500/30" />
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