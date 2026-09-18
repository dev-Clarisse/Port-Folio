import { BriefcaseBusiness, GraduationCap, Rocket } from "lucide-react";
import "@/App.css";

function Experiences() {
    return (
        <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 text-white sm:px-10">
            <header className="mx-auto mb-16 max-w-2xl text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--pastel-petal)]">
                    My journey
                </p>
                <h1 className="neon-2 text-4xl font-semibold text-[var(--thistle)] sm:text-5xl">
                    Experiences
                </h1>
                <p className="mt-5 text-base leading-7 text-[var(--thistle-2)]">
                    Les étapes qui ont construit mon parcours, mes compétences et ma façon de créer.
                </p>
            </header>

            <div className="relative">
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-5 top-0 w-1 rounded-full bg-gradient-to-b from-[var(--pastel-petal)] via-[var(--bright-lavender)] to-[var(--deep-lilac-3)] shadow-[0_0_18px_var(--lavender-purple)] sm:left-1/2 sm:-translate-x-1/2"
                />

                <div className="space-y-12 sm:space-y-20">
                    {[
                        {
                            date: "2022 — 2023",
                            title: "Première expérience",
                            icon: GraduationCap,
                            text: "Écris ici une présentation de ta première expérience : le contexte, tes missions et ce que tu as appris.",
                            accent: "from-[var(--thistle)] to-[var(--wisteria-2)]",
                        },
                        {
                            date: "2023 — 2024",
                            title: "Projet professionnel",
                            icon: BriefcaseBusiness,
                            text: "Écris ici les détails de ton expérience professionnelle, les technologies utilisées et les résultats obtenus.",
                            accent: "from-[var(--bright-lavender)] to-[var(--lavender-purple)]",
                        },
                        {
                            date: "2024 — Aujourd’hui",
                            title: "Nouveau chapitre",
                            icon: Rocket,
                            text: "Écris ici ton expérience actuelle, tes objectifs et les projets qui te motivent pour la suite.",
                            accent: "from-[var(--lavender-purple)] to-[var(--deep-lilac-3)]",
                        },
                    ].map(({ date, title, icon: Icon, text, accent }, index) => (
                        <article
                            key={title}
                            className={`relative pl-14 sm:flex sm:items-center sm:gap-12 sm:pl-0 ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                                }`}
                        >
                            <div className="absolute left-0 top-8 z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-black bg-[var(--deep-lilac-3)] text-[var(--pastel-petal)] shadow-[0_0_18px_var(--lavender-purple)] sm:static sm:shrink-0">
                                <Icon size={20} aria-hidden="true" />
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-[var(--wisteria-2)]/50 bg-[#1a1025]/90 p-6 shadow-[0_0_24px_rgba(129,90,192,0.2)] transition duration-300 hover:-translate-y-1 hover:border-[var(--pastel-petal)] hover:shadow-[0_0_30px_rgba(193,158,224,0.35)] sm:w-[calc(50%-3rem)]">
                                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
                                <p className="mb-2 text-sm font-semibold tracking-widest text-[var(--pastel-petal)]">
                                    {date}
                                </p>
                                <h2 className="mb-3 text-2xl font-semibold text-[var(--thistle)]">
                                    {title}
                                </h2>
                                <p className="leading-7 text-[var(--thistle-2)]">
                                    {text}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>

    )
}

export default Experiences