import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import ChatTerminal from './ChatTerminal';
import { useLanguage } from '../context/LanguageContext';

/* ─────────────────────────────────────────────────────────────────
   FloatingChatButton — redesigned to match the portfolio aesthetic
   (aurora glow + theme-aware), but it still opens the original
   <ChatTerminal /> terminal experience exactly as it was on `main`.
   All open/close props and handlers are preserved.
   ───────────────────────────────────────────────────────────────── */
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

  useEffect(() => {
    if (onChatOpen) {
      onChatOpen(handleOpen);
    }
  }, [onChatOpen]);

  return (
    <>
      {!isOpen && (
        <div className="floating-chat fixed bottom-5 right-4 sm:bottom-6 sm:right-6 md:bottom-7 md:right-7 z-50 flex items-center gap-3">
          {/* Hover label — slides in from the right of the button */}
          <div
            className={`floating-chat-label hidden sm:flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-medium backdrop-blur-md transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
            }`}
          >
            <span className="font-mono text-[var(--fcb-prompt)]">{`>_`}</span>
            <span>Chat with Giacomo</span>
          </div>

          {/* The button itself — round, aurora-glow, theme-aware */}
          <button
            ref={buttonRef}
            onClick={() => handleOpen()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`floating-chat-btn group relative grid h-14 w-14 md:h-16 md:w-16 place-items-center rounded-full transition-transform duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            aria-label={t('chat.openButton') || 'Open chat'}
          >
            {/* Outer aurora ring (animated) */}
            <span className="floating-chat-ring pointer-events-none absolute -inset-1 rounded-full opacity-80" />
            {/* Soft outer halo */}
            <span className="floating-chat-halo pointer-events-none absolute -inset-3 rounded-full blur-2xl opacity-70" />
            {/* Solid surface */}
            <span className="floating-chat-surface absolute inset-0 rounded-full" />

            {/* Terminal-cursor glyph */}
            <span className="relative z-10 flex items-center font-mono text-[15px] md:text-[17px] font-semibold tracking-tight text-[var(--fcb-prompt)]">
              <span className="opacity-90">&gt;_</span>
              <span className="floating-chat-cursor ml-0.5 inline-block h-[1.05em] w-[2px] align-middle bg-[var(--fcb-prompt)]" />
            </span>

            {/* Online indicator (green pulse) */}
            <span className="absolute -top-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span
                className="relative h-2.5 w-2.5 rounded-full"
                style={{ background: '#10b981', boxShadow: '0 0 0 1.5px var(--fcb-bg)' }}
              />
            </span>
          </button>
        </div>
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
