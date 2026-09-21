
import Footer from "./components/layout/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Background from './components/layout/Background/Background'
import Cursor from "./components/layout/Cursor/Cursor"
import { lazy, Suspense, useEffect, useRef } from "react";
import BackButton from "./components/layout/BackButton/BackButton"

const Home = lazy(() => import("./components/sections/Home/Home"));
const AboutMe = lazy(() => import("./components/sections/AboutMe/AboutMe"));
const Academic = lazy(() => import("./components/sections/Academic/Academic"));
const Experiences = lazy(() => import("./components/sections/Experiences/Experiences"));
const Skills = lazy(() => import("./components/sections/Skills/Skills"));
const Projects = lazy(() => import("./components/sections/Projects/Projects"));
const ProfessionalProject = lazy(() => import("./components/sections/ProfessionnalProject/ProfessionalProject"));
const Challenges = lazy(() => import("./components/sections/Challenges/Challenges"));

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
      <audio ref={audioRef} src="/sounds/chill.mp3" loop preload="none" />
      <main className="flex-1 flex flex-col pb-16.25 sm:pb-16.25">
        <Cursor />
        <Background>
          <BackButton />
          <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/professional-project" element={<ProfessionalProject />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
          </Suspense>
        </Background>
      </main>
      <Footer />
    </div>
  );


}

export default App
