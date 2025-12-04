import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="text-xl font-bold text-white hover:text-cyan-400 transition-colors"
          >
            GR
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('projects')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('formation')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Formation
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-2 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-cyan-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-6 py-4 space-y-4">
            <button
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('formation')}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors"
            >
              Formation
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-6 py-2 bg-cyan-500 text-black font-medium rounded-full hover:bg-cyan-400 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;