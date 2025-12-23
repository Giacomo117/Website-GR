import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpaceBackground } from './ui/space-background';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Set loading complete after 3 seconds
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => onLoadingComplete(), 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-8"
        >
          {/* Space Background Animation */}
          <SpaceBackground particleCount={450} particleColor="#00D9FF" backgroundColor="transparent" />
          
          {/* Logo/Name */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 relative z-10"
          >
            <img 
              src="/Logo-2.png" 
              alt="GR Logo" 
              className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4"
            />
            <p className="text-gray-400 text-lg">Loading Portfolio...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;