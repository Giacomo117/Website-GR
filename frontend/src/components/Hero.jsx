import React from 'react';
import { ShaderAnimation } from './ui/shader-lines';
import { Spotlight } from './ui/spotlight';
import { Card } from './ui/card';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ onChatOpen }) => {
  const { t } = useLanguage();
  
  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center">
      <Card className="w-full min-h-screen bg-black relative border-0 rounded-none overflow-visible">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#00D9FF"
        />
        
        {/* Shader Lines Background - Full Screen */}
        <div className="absolute inset-0 z-0 -top-64 md:top-0">
          <ShaderAnimation />
        </div>

        {/* Fade gradient at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

        {/* Content Overlay - pointer-events-none to allow interaction with 3D */}
        <div className="relative z-10 min-h-screen flex items-center justify-center pointer-events-none">
          <div className="w-full p-8 lg:p-16">
            <div className="max-w-3xl mx-auto text-center">
              {/* Welcome Badge */}
              <div className="mb-6 flex justify-center">
                <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40 rounded-full text-cyan-400 text-xs md:text-sm font-medium">
                  {t('hero.welcome')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 font-['Space_Grotesk'] drop-shadow-lg">
                {t('hero.greeting')} <span className="text-cyan-400">{t('hero.name')}</span>
              </h1>
              
              <p className="text-lg md:text-2xl lg:text-3xl text-gray-200 mb-6 md:mb-8 font-['Space_Grotesk'] font-medium drop-shadow-md">
                {t('hero.role')}
              </p>
              
              {/* Description - Hidden on Mobile, Visible on Desktop */}
              <p className="hidden md:block text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-lg border border-white/10">
                {t('hero.description')}
              </p>
              
              {/* Buttons - Smaller on Mobile */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-center justify-center">
                <button
                  onClick={scrollToProjects}
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-8 py-2.5 md:py-4 bg-cyan-500 text-black font-semibold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/50 pointer-events-auto text-xs md:text-base w-full sm:w-auto"
                >
                  {t('hero.cta')}
                  <ArrowDown size={14} className="md:w-5 md:h-5" />
                </button>
                <button
                  onClick={onChatOpen}
                  className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-8 py-2.5 md:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 hover:border-cyan-400/50 pointer-events-auto text-xs md:text-base w-full sm:w-auto"
                >
                  <MessageSquare size={14} className="md:w-5 md:h-5" />
                  {t('hero.chatCta')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Hero;