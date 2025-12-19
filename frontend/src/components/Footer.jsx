import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">Giacomo Reggianini</h3>
            <p className="text-gray-400 text-sm">
              AI Engineer crafting intelligent solutions
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © {currentYear} All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Giacomo117"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-cyan-500/10 border border-zinc-700 hover:border-cyan-500/50 flex items-center justify-center transition-all duration-300 group"
              aria-label="GitHub"
            >
              <Github className="text-gray-400 group-hover:text-cyan-400 transition-colors" size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/giacomo-reggianini-0667bb300/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-cyan-500/10 border border-zinc-700 hover:border-cyan-500/50 flex items-center justify-center transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="text-gray-400 group-hover:text-cyan-400 transition-colors" size={20} />
            </a>
            <a
              href="mailto:reggianini.giacomo01@gmail.com"
              className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-cyan-500/10 border border-zinc-700 hover:border-cyan-500/50 flex items-center justify-center transition-all duration-300 group"
              aria-label="Email"
            >
              <Mail className="text-gray-400 group-hover:text-cyan-400 transition-colors" size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;