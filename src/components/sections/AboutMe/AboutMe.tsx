import '@/App.css';
import imageMe from '@/assets/me.jpeg';
import FlowerBoxMe from '@/components/Box/FlowerBoxMe';
import { Heart } from "lucide-react";
import { useEffect } from "react";

function AboutMe() {

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
        <div className="w-full h-dvh md:h-full overflow-hidden flex items-center justify-center px-4 py-16 sm:px-8 md:p-8 md:translate-y-30">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">

                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 shrink-0 md:-translate-x-20 animate-slide-in-left">
                    <FlowerBoxMe className="absolute inset-0 w-full h-full object-cover" image={imageMe} />
                </div>

                {/* Carte d'information */}
                <div className="w-full max-w-2xl animate-slide-in-top">
                    <div className="bg-[#180e29]/90 backdrop-blur-md border border-lilac-800/40 rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-300 hover:border-lilac-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        
                        {/* En-tête */}
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-lilac-900/60">
                            <div className="p-2 rounded-lg bg-lilac-950 border border-lilac-800/50 text-lilac-300 shrink-0">
                                <Heart size={20} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-lilac-100">
                                Hi! I'm Clarisse Del Castillo
                            </h3>
                        </div>

                        {/* Contenu */}
                        <div className="space-y-3 text-sm sm:text-base text-lilac-200/90 leading-relaxed">
                            <p>
                                Born on March 15, 2004, in Ermont (Val-d'Oise, 95) — 22 years old.
                            </p>
                            <p>
                                Currently in my 4th year at EPF, a general engineering school, majoring in <span className="text-lilac-300 font-semibold">Digital and Intelligent Systems</span>.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default AboutMe;