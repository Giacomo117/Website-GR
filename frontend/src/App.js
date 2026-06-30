import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LanguageProvider as ChatLanguageProvider } from "./context/LanguageContext";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LogoCloud from "./components/LogoCloud";
import ScrollRevealText from "./components/ScrollRevealText";
import About from "./components/About";
import Services from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingChatButton from "./components/FloatingChatButton";
import { useLang } from "./i18n/LanguageContext";
import { Toaster } from "./components/ui/sonner";

const Home = () => {
  const { c } = useLang();
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <section className="relative bg-[#060608]">
          {c.statements.map((s, i) => (
            <ScrollRevealText key={`${s.accent}-${i}`} text={s.text} accent={s.accent} />
          ))}
        </section>
        <About />
        <Services />
        <CaseStudies />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

const ThemedToaster = () => {
  const { theme } = useTheme();
  return <Toaster position="bottom-center" theme={theme} />;
};

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <LanguageProvider>
          <ChatLanguageProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </BrowserRouter>
            <FloatingChatButton />
            <ThemedToaster />
          </ChatLanguageProvider>
        </LanguageProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
