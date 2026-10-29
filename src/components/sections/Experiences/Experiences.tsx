import { Mouse } from "lucide-react";
import { lazy, Suspense, useRef } from "react";
import "@/App.css";
import { experiences } from "@/data/experiences";
import { useMediaQuery } from "@/Hooks/MediaQuery";
import { ExperienceCard, ExperienceIcon } from "./ExperienceCard";

const ExperienceHelix = lazy(() => import("@/components/3D/ExperienceHelix"));

// Frise 2D : affichée sur mobile et quand l'utilisateur a désactivé les animations
function Timeline() {
    return (
        <div className="relative">
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-5 top-0 w-1 rounded-full bg-linear-to-b from-lilac-1100 via-lilac-500 to-lilac-950 shadow-[0_0_18px_var(--lavender-purple)] sm:left-1/2 sm:-translate-x-1/2"
            />

            <div className="space-y-12 sm:space-y-20">
                {experiences.map((experience, index) => (
                    <article
                        key={experience.title}
                        className={`relative pl-14 sm:flex sm:items-center sm:gap-12 sm:pl-0 ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                            }`}
                    >
                        <ExperienceIcon experience={experience} className="absolute left-0 top-8 z-10 sm:static sm:shrink-0" />
                        <ExperienceCard experience={experience} className="sm:w-[calc(50%-3rem)]" />
                    </article>
                ))}
            </div>
        </div>
    );
}

function Experiences() {
    // Hélice 3D sur les écrans moyens et grands, sauf si les animations sont désactivées
    const show3D = useMediaQuery("(min-width: 48rem) and (prefers-reduced-motion: no-preference)");
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 text-white sm:px-10">
            <header className="mx-auto mb-16 max-w-2xl text-center">

                <h1 className="text-4xl font-bold text-lilac-1000 mb-2 pt-11 sm:pt-8">
                    Experiences
                </h1>
                <p className="mt-5 text-base leading-7 text-lilac-200">
                    The milestones that have shaped my career, my skills and my creative process.
                </p>
                {show3D && (
                    <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-lilac-500/30 bg-lilac-950/60 px-3 py-1 text-xs text-lilac-200">
                        <Mouse size={14} className="animate-bounce" aria-hidden="true" />
                        Scroll to wrap through my journey
                    </span>
                )}
            </header>

            {show3D ? (
                // Zone haute : son défilement fait tourner l'hélice, la scène reste collée à l'écran.
                // Les cartes 3D sont de vrais éléments HTML : elles restent lisibles par les lecteurs d'écran.
                <div ref={scrollRef} className="relative" style={{ height: `${experiences.length * 100}dvh` }}>
                    <div className="sticky top-0 h-dvh">
                        <Suspense fallback={null}>
                            <ExperienceHelix scrollRef={scrollRef} />
                        </Suspense>
                    </div>
                </div>
            ) : (
                <Timeline />
            )}
        </section>
    );
}

export default Experiences;
