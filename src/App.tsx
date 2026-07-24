
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

function App() {
  return (

    <div className="min-h-screen flex flex-col">
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
