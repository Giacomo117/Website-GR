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
    <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <Card className="w-full min-h-screen bg-black relative overflow-hidden border-0 rounded-none">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="#00D9FF"
        />
        
        <div className="flex flex-col lg:flex-row h-full min-h-screen">
          {/* Left content */}
          <div className="flex-1 p-8 lg:p-16 relative z-10 flex flex-col justify-center">
            <div className="max-w-2xl">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-4">
                  Welcome to my portfolio
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 font-['Space_Grotesk']">
                Hello, I'm <span className="text-cyan-400">Giacomo</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 font-['Space_Grotesk'] font-medium">
                AI Engineer crafting intelligent solutions
              </p>
              <p className="text-base md:text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                Computer Engineer specializing in Artificial Intelligence with experience in developing distributed systems and enterprise architectures. Transforming innovative ideas into concrete and scalable solutions.
              </p>
              <button
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 text-black font-semibold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95"
              >
                View My Work
                <ArrowDown size={20} />
              </button>
            </div>
          </div>

          {/* Right content - 3D Spline */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-screen">
            <div className="absolute inset-0">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default Hero;