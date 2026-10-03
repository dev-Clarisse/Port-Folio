import { IoLogoLinkedin } from "react-icons/io";
import { FaGithub } from "react-icons/fa";
import { AtSign } from "lucide-react";
import ContactDialog from "@/components/Form/ContactDialog";
import { useLocation } from "react-router-dom";

export default function Footer() {

  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <footer className="hidden md:flex md:fixed md:bottom-0 left-0 w-full z-50 isolate overflow-visible bg-[#1a1025] text-white/80 px-10 py-4 flex-col sm:flex-row justify-between gap-10 before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-[#1a1025] before:content-['']">
      <nav>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-5">
            <ContactDialog />
          </div>
        </div>
      </nav>

      <nav>
        <div className="flex items-center gap-4">
          <AtSign size={20} className="text-lg font-semibold text-[var(--lavender-purple)]" />
          <p>clarisse15032004@gmail.com</p>
        </div>
      </nav>

      <nav>
        <div className="flex items-center gap-4">
          <h6 className="text-lg font-semibold text-[var(--lavender-purple)]">Media</h6>
          <div className="flex gap-2">
            <a href="https://github.com/dev-Clarisse" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_8px_var(--lavender-purple)] transition">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com/in/clarisse-del-castillo" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_8px_var(--lavender-purple)] transition">
              <IoLogoLinkedin size={20} />
            </a>
          </div>
        </div>
      </nav>
    </footer>
  );
}