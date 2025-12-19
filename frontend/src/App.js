import React, { useRef, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Formation from "./components/Formation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const openChatWithMessage = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleProjectClick = (message) => {
    if (openChatWithMessage.current) {
      openChatWithMessage.current(message);
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div className="App" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        <Navbar />
        <Hero />
        <Projects onProjectClick={handleProjectClick} />
        <Formation />
        <Contact />
        <Footer />
        <FloatingChatButton onChatOpen={(fn) => openChatWithMessage.current = fn} />
      </div>
    </>
  );
}

export default App;