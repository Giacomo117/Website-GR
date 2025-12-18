import React, { useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Formation from "./components/Formation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";

function App() {
  const openChatWithMessage = useRef(null);

  const handleProjectClick = (message) => {
    if (openChatWithMessage.current) {
      openChatWithMessage.current(message);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Projects onProjectClick={handleProjectClick} />
      <Formation />
      <Contact />
      <Footer />
      <FloatingChatButton onMessageSet={(fn) => openChatWithMessage.current = fn} />
    </div>
  );
}

export default App;