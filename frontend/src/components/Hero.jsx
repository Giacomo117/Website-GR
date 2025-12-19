import React from 'react';
import { SplineScene } from './ui/splite';
import { Spotlight } from './ui/spotlight';
import { Card } from './ui/card';
import { ArrowDown, MessageSquare } from 'lucide-react';

const Hero = ({ onChatOpen }) => {
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
        
        {/* 3D Spline Background - Full Screen with Interaction - Allow overflow */}
        <div className="absolute inset-0 z-0" style={{ height: '120vh', willChange: 'transform' }}>
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Content Overlay - pointer-events-none to allow interaction with 3D */}
        <div className="relative z-10 min-h-screen flex items-center pointer-events-none">
          <div className="w-full p-8 lg:p-16">
            <div className="max-w-3xl">
              {/* Welcome Badge - Centered on Mobile */}
              <div className="mb-6 flex justify-center md:justify-start">
                <span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40 rounded-full text-cyan-400 text-xs md:text-sm font-medium">
                  Welcome to my portfolio
                </span>
              </div>
              
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 font-['Space_Grotesk'] drop-shadow-lg text-center md:text-left">
                Hello, I'm <span className="text-cyan-400">Giacomo</span>
              </h1>
              
              <p className="text-lg md:text-2xl lg:text-3xl text-gray-200 mb-6 md:mb-8 font-['Space_Grotesk'] font-medium drop-shadow-md text-center md:text-left">
                AI Engineer crafting intelligent solutions
              </p>
              
              {/* Description - Short on Mobile, Long on Desktop */}
              <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl leading-relaxed backdrop-blur-sm bg-black/20 p-3 md:p-4 rounded-lg border border-white/10 text-center md:text-left">
                <span className="md:hidden">Specialized in AI & distributed systems</span>
                <span className="hidden md:inline">Computer Engineer specializing in Artificial Intelligence with experience in developing distributed systems and enterprise architectures. Transforming innovative ideas into concrete and scalable solutions.</span>
              </p>
              
              {/* Buttons - Smaller on Mobile */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center md:items-start">
                <button
                  onClick={scrollToProjects}
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-cyan-500 text-black font-semibold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/50 pointer-events-auto text-sm md:text-base w-full sm:w-auto"
                >
                  View My Work
                  <ArrowDown size={18} className="md:w-5 md:h-5" />
                </button>
                <button
                  onClick={onChatOpen}
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 hover:border-cyan-400/50 pointer-events-auto text-sm md:text-base w-full sm:w-auto"
                >
                  <MessageSquare size={18} className="md:w-5 md:h-5" />
                  Ask AI About Me
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