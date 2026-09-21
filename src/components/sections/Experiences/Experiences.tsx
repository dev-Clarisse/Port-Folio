import { BriefcaseBusiness, MapPin, HeartHandshake, Store, FileText } from "lucide-react";
import "@/App.css";
import { Button } from "@/components/ui/button";

function Experiences() {
    return (
        <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 text-white sm:px-10">
            <header className="mx-auto mb-16 max-w-2xl text-center">

                <h1 className="neon-2 text-6xl font-citation text-lilac-950 sm:text-6xl">
                    Experiences
                </h1>
                <p className="mt-5 text-base leading-7 text-lilac-200">
                    The milestones that have shaped my career, my skills and my creative process.
                </p>
            </header>

            <div className="relative">
                <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-5 top-0 w-1 rounded-full bg-linear-to-b from-lilac-1100 via-lilac-500 to-lilac-950 shadow-[0_0_18px_var(--lavender-purple)] sm:left-1/2 sm:-translate-x-1/2"
                />

                <div className="space-y-12 sm:space-y-20">
                    {[
                        {
                            date: "Aug 2025 – Dec 2025",
                            title: "Software Quality Support & Development",
                            icon: BriefcaseBusiness,
                            where: "Audirvana, Paris",
                            text: [
                                "Handled international user enquiries by email, guided users in using the software and resolving technical issues.",
                                "Verified that software and applications functioned properly through testing to ensure an optimal user experience. Conducted UI/UX quality assurance to ensure visual polish and intuitive navigation.",
                                "Designed and developed an interactive Java game to help users understand the role of an equalizer and to enhance user engagement."
                            ],
                            pdfUrl: "/pdfs/DEL_CASTILLO_Clarisse_Cachan_SEI_P2027.pdf",
                            accent: "from-[var(--thistle)] to-[var(--wisteria-2)]",
                        },
                        {
                            date: "July 2024 – 1 month",
                            title: "Volunteer Assistant",
                            icon: HeartHandshake,
                            where: "Les Auxiliaires des Aveugles, Paris area",
                            text: ["Provided daily support to visually impaired and blind individuals in their activities.",
                                "Assisted during travel and external appointments.",
                                "Participated in organising activities promoting well-being and independence."
                            ],
                            pdfUrl: "",
                            accent: "from-[var(--bright-lavender)] to-[var(--lavender-purple)]",
                        },
                        {
                            date: "Aug 2023 – 1 month",
                            title: "Retail Sales Assistant",
                            icon: Store,
                            where: "Vendôme, France",
                            text: ["Organized product displays, managed the stockroom, and welcomedand assisted customers on the shop floor."],
                            pdfUrl: "/pdfs/DEL_CASTILLO_Clarisse_Cachan_EXE_P2027.pdf",
                            accent: "from-[var(--lavender-purple)] to-[var(--deep-lilac-3)]",
                        },
                    ].map(({ date, title, icon: Icon, where, text, pdfUrl, accent }, index) => (
                        <article
                            key={title}
                            className={`relative pl-14 sm:flex sm:items-center sm:gap-12 sm:pl-0 ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                                }`}
                        >
                            <div className="absolute left-0 top-8 z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-black bg-lilac-950 text-lilac-1100` shadow-[0_0_18px_var(--lavender-purple)] sm:static sm:shrink-0">
                                <Icon size={20} aria-hidden="true" />
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-(--wisteria-2)/50 bg-[#1a1025]/90 p-6 shadow-[0_0_24px_rgba(129,90,192,0.2)] transition duration-300 hover:-translate-y-1 hover:border-lilac-1100 hover:shadow-[0_0_30px_rgba(193,158,224,0.35)] sm:w-[calc(50%-3rem)]">
                                <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`} />

                                <h2 className="mb-3 text-2xl font-semibold text-lilac-100">
                                    {title}
                                </h2>

                                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span className="text-sm font-semibold tracking-widest text-lilac-1100">
                                        {date}
                                    </span>
                                    {where && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-lilac-1100/40 bg-lilac-950/30 px-2.5 py-0.5 text-xs font-medium text-lilac-1100 backdrop-blur-sm">
                                            <MapPin size={12} className="text-lilac-1100" />
                                            {where}
                                        </span>
                                    )}
                                </div>


                                {Array.isArray(text) ? (
                                    <ul className="list-disc space-y-2 pl-5 text-lilac-200">
                                        {text.map((item, i) => (
                                            <li key={i} className="leading-relaxed">
                                                {item.replace(/^-\s*/, '')}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="leading-7 text-lilac-200">
                                        {text}
                                    </p>
                                )}

                                {pdfUrl && (
                                    <div className="mt-4 flex justify-center">
                                        <Button
                                            asChild
                                            className="btn-glossy bg-lilac-950 text-lilac-100 text-base transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--color-lilac-400)]"
                                        >
                                            <a
                                                href={pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2"
                                            >
                                                <FileText size={18} aria-hidden="true" />
                                                <span>View the work placement report</span>
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Experiences;