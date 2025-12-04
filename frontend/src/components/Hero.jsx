import React from 'react';
import { SplineScene } from './ui/splite';
import { Spotlight } from './ui/spotlight';
import { Card } from './ui/card';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
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
        <div className="absolute inset-0 z-0" style={{ height: '120vh' }}>
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Content Overlay - pointer-events-none to allow interaction with 3D */}
        <div className="relative z-10 min-h-screen flex items-center pointer-events-none">
          <div className="w-full p-8 lg:p-16">
            <div className="max-w-3xl">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/40 rounded-full text-cyan-400 text-sm font-medium mb-4">
                  Welcome to my portfolio
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 font-['Space_Grotesk'] drop-shadow-lg">
                Hello, I'm <span className="text-cyan-400">Giacomo</span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 font-['Space_Grotesk'] font-medium drop-shadow-md">
                AI Engineer crafting intelligent solutions
              </p>
              <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-lg border border-white/10">
                Computer Engineer specializing in Artificial Intelligence with experience in developing distributed systems and enterprise architectures. Transforming innovative ideas into concrete and scalable solutions.
              </p>
              <button
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black font-semibold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/50 pointer-events-auto"
              >
                View My Work
                <ArrowDown size={20} />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Hero;