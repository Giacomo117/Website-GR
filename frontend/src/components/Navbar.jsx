import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:opacity-80 transition-opacity z-10"
          >
            <img src="/Logo-2.png" alt="GR Logo" className="h-10 w-10" />
          </button>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-full px-2 py-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium text-sm"
              >
                {t('nav.projects')}
              </button>
              <button
                onClick={() => scrollToSection('formation')}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium text-sm"
              >
                {t('nav.formation')}
              </button>
              <button
                onClick={() => scrollToSection('experience')}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium text-sm"
              >
                {t('nav.experience')}
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-full hover:bg-cyan-400 transition-all text-sm"
              >
                {t('nav.contact')}
              </button>
            </div>
          </div>

          {/* Language Selector - Right side */}
          <div className="hidden md:block">
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-cyan-400 transition-colors p-2 z-10"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-4 space-y-3 flex flex-col items-center">
            <button
              onClick={() => scrollToSection('projects')}
              className="w-full max-w-xs text-center px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('nav.projects')}
            </button>
            <button
              onClick={() => scrollToSection('formation')}
              className="w-full max-w-xs text-center px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('nav.formation')}
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className="w-full max-w-xs text-center px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              {t('nav.experience')}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full max-w-xs text-center px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-all"
            >
              {t('nav.contact')}
            </button>
            {/* Mobile Language Selector */}
            <div className="pt-2">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;