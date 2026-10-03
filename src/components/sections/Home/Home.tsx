import '@/App.css';
import FlowersGL from "@/components/3D/FlowersGL";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sound } from "@/Hooks/Sound";
import { useEffect, useState } from "react";
import { navItems } from "@/data/navItems";

function Home() {
    const navigate = useNavigate();
    const playClick = Sound("/sounds/clic.mp3");

    useEffect(() => {
        const originalBody = document.body.style.overflow;
        const originalHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalBody;
            document.documentElement.style.overflow = originalHtml;
        };
    }, []);


    return (
        <div className="relative isolate h-dvh md:h-auto md:min-h-dvh w-full flex flex-col items-center justify-center gap-4 md:gap-0 overflow-hidden px-4 py-16 md:py-12">

            {/* ───────── Fleur 3D ───────── */}
            <div className="
                relative z-0 pointer-events-none
                w-[min(80vw,340px,40dvh)] aspect-square
                md:absolute md:aspect-auto md:top-1/2 md:left-[4%] md:-translate-y-1/2
                md:h-[min(65vh,450px)] md:w-[min(44vw,480px)]
            ">
                <div className="h-full w-full">
                    <FlowersGL />
                </div>
            </div>

            {/* ───────── Citation (au-dessus de la fleur sur mobile) ───────── */}
            <h1 className="
                neon citation relative z-10 font-citation text-lilac-950 text-center text-balance
                text-[clamp(1.6rem,7.5vw,2.25rem)] leading-snug
                max-w-xs sm:max-w-md
                m-0
                md:text-2xl lg:text-5xl
                md:max-w-3xl lg:max-w-4xl
                md:mt-0 md:mb-0
                md:absolute md:top-1/3 md:right-[10%] md:left-auto md:translate-x-6
            ">
                ❝It takes a whole lifetime to learn how to live.❞
            </h1>



            {/* ───────── Boutons desktop (inchangés) ───────── */}
            <div className="z-10 hidden md:flex flex-wrap justify-center gap-3 md:max-w-3xl xl:max-w-5xl xl:flex-nowrap md:mt-60 xl:translate-x-20">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                            }}
                            className="btn-glossy transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--color-lilac-400)] flex items-center gap-2 text-xs sm:text-sm"
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
export default Home;