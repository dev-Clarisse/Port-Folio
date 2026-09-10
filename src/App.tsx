
import Footer from "./components/layout/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Background from './components/layout/Background/Background'
import Home from './components/sections/Home/Home'
import AboutMe from './components/sections/AboutMe/AboutMe'
import Academic from './components/sections/Academic/Academic'
import Skills from './components/sections/Skills/Skills'
import Projects from './components/sections/Projects/Projects'
import ProfessionalProject from './components/sections/ProfessionnalProject/ProfessionalProject'
import Challenges from './components/sections/Challenges/Challenges'
import Cursor from "./components/layout/Cursor/Cursor"
import { useEffect, useRef } from "react";

function App() {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3; 
        audioRef.current.play().catch((err) => console.log("Lecture bloquée :", err));
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  return (

    <div className="min-h-screen flex flex-col">
      <audio ref={audioRef} src="/sounds/chill.mp3" loop preload="auto" />
      <main className="flex-1 flex flex-col pb-[65px] sm:pb-[65px]">
        <Cursor />
        <Background>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/professional-project" element={<ProfessionalProject />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </Background>
      </main>
      <Footer />
    </div>
  );


}

export default App
