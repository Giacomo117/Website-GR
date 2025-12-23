import React, { useRef, useState } from "react";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VoiceAssistant from "./components/VoiceAssistant";
import Projects from "./components/Projects";
import Formation from "./components/Formation";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const openChatWithMessage = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleProjectClick = (projectData) => {
    if (openChatWithMessage.current) {
      openChatWithMessage.current(projectData);
    }
  };

  const handleOpenChat = () => {
    if (openChatWithMessage.current) {
      openChatWithMessage.current(null);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <LanguageProvider>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="App" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        <Navbar onChatOpen={handleOpenChat} />
        <Hero onChatOpen={handleOpenChat} />
        <VoiceAssistant onOpenChatWithMessage={handleProjectClick} />
        <Projects onProjectClick={handleProjectClick} />
        <Formation />
        <Experience />
        <Contact onChatOpen={handleOpenChat} />
        <Footer />
        <FloatingChatButton onChatOpen={(fn) => openChatWithMessage.current = fn} />
      </div>
    </LanguageProvider>
  );
}

export default App;