import { AtSign } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContactDialog from "@/components/Form/ContactDialog";
import { Button } from "@/components/ui/button";
import { Sound } from "@/Hooks/Sound";
import { navItems } from "@/data/navItems";

export default function MobileMenu() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const playClick = Sound("/sounds/clic.mp3");
    const [menuOpen, setMenuOpen] = useState(false);

    // Ferme le menu à chaque changement de page
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Bloque le scroll de la page quand le menu est ouvert
    useEffect(() => {
        if (!menuOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = original;
        };
    }, [menuOpen]);

    const go = (path: string) => {
        playClick?.();
        setMenuOpen(false);
        navigate(path);
    };

    return (
        <>
            {/* Bouton burger */}
            <Button
                type="button"
                onClick={() => {
                    playClick?.();
                    setMenuOpen((o) => !o);
                }}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                variant="ghost"
                size="icon-sm"
                className="group md:hidden fixed top-4 right-4 z-[60] flex flex-col items-center justify-center gap-[5px] bg-transparent aria-expanded:bg-transparent hover:bg-white aria-expanded:hover:bg-white focus-visible:bg-transparent"
            >
                <span
                    className={`block h-0.5 w-6 rounded-full transition-all duration-300 group-hover:bg-lilac-800 ${menuOpen
                        ? "bg-lilac-400 translate-y-[7px] rotate-45"
                        : "bg-lilac-600"
                        }`}
                />
                <span
                    className={`block h-0.5 w-6 rounded-full transition-all duration-300 group-hover:bg-lilac-800 ${menuOpen
                        ? "bg-lilac-400 opacity-0"
                        : "bg-lilac-600"
                        }`}
                />
                <span
                    className={`block h-0.5 w-6 rounded-full transition-all duration-300 group-hover:bg-lilac-800 ${menuOpen
                        ? "bg-lilac-400 -translate-y-[7px] -rotate-45"
                        : "bg-lilac-600"
                        }`}
                />
            </Button>

            {/* ───────── Fond sombre cliquable (mobile uniquement) ───────── */}
            <div
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
                className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* ───────── Menu latéral (mobile uniquement) ───────── */}
            <div
                aria-hidden={!menuOpen}
                className={`md:hidden fixed top-0 right-0 z-50 flex h-dvh w-1/3 min-w-[200px] flex-col items-center overflow-y-auto rounded-l-2xl bg-linear-to-b from-lilac-950 to-lilac-1000 px-4 pt-20 pb-8 shadow-[-8px_0_30px_rgba(0,0,0,0.5)] transition-[transform,visibility] duration-300 ${menuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
                    }`}
            >
                <nav className="flex w-full flex-col gap-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.path}
                                onClick={() => go(item.path)}
                                className="btn-glossy transition-all duration-300 h-auto w-full justify-center gap-2 whitespace-normal py-2 text-center text-xs bg-white/10 text-lilac-100 border border-lilac-300/30 hover:bg-white/20"
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>

                <div className="mt-6 flex w-full flex-col items-center gap-4 border-t border-lilac-300/30 pt-5 text-center text-lilac-100">
                    <ContactDialog triggerClassName="w-full justify-center text-xs" />

                    <a href="mailto:clarisse15032004@gmail.com" className="flex items-center justify-center gap-2 text-center text-xs break-all">
                        <AtSign size={16} className="text-lilac-300 shrink-0" />
                        clarisse15032004@gmail.com
                    </a>

                    <div className="flex items-center justify-center gap-3">
                        <span className="text-sm font-semibold text-lilac-300">Media</span>
                        <a href="https://github.com/dev-Clarisse" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <FaGithub size={20} />
                        </a>
                        <a href="https://linkedin.com/in/clarisse-del-castillo" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <IoLogoLinkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}