import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Formation from "./components/Formation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Projects />
      <Formation />
      <Contact />
      <Footer />
      <FloatingChatButton />
    </div>
  );
}

export default App;