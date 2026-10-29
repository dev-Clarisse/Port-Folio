import { MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Experience } from "@/data/experiences";

// Rond avec l'icône de l'expérience (posé sur la barre de la frise)
export function ExperienceIcon({ experience, className = "" }: { experience: Experience; className?: string }) {
    const Icon = experience.icon;
    return (
        <div className={`flex h-11 w-11 items-center justify-center rounded-full border-4 border-black bg-lilac-950 text-lilac-1100 shadow-[0_0_18px_var(--lavender-purple)] ${className}`}>
            <Icon size={20} aria-hidden="true" />
        </div>
    );
}

// Carte d'une expérience, partagée par la frise 2D et l'hélice 3D
export function ExperienceCard({ experience, className = "" }: { experience: Experience; className?: string }) {
    const { date, title, where, text, pdfUrl, accent } = experience;
    return (
        <div className={`group relative overflow-hidden rounded-2xl border border-(--wisteria-2)/50 bg-[#1a1025]/90 p-6 text-white shadow-[0_0_24px_rgba(129,90,192,0.2)] transition duration-300 hover:-translate-y-1 hover:border-lilac-1100 hover:shadow-[0_0_30px_rgba(193,158,224,0.35)] ${className}`}>
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

            <ul className="list-disc space-y-2 pl-5 text-lilac-200">
                {text.map((item, i) => (
                    <li key={i} className="leading-relaxed">
                        {item}
                    </li>
                ))}
            </ul>

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
                            <span>View the report</span>
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
}
