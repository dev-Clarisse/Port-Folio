import { BriefcaseBusiness, HeartHandshake, Store, type LucideIcon } from "lucide-react";

export type Experience = {
    date: string;
    title: string;
    icon: LucideIcon;
    where: string;
    text: string[];
    pdfUrl: string;
    accent: string;
    accentColor: string;
};

export const experiences: Experience[] = [
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
        accentColor: "#c19ee0",
    },
    {
        date: "July 2024 – 1 month",
        title: "Volunteer Assistant",
        icon: HeartHandshake,
        where: "Les Auxiliaires des Aveugles, Paris area",
        text: [
            "Provided daily support to visually impaired and blind individuals in their activities.",
            "Assisted during travel and external appointments.",
            "Participated in organising activities promoting well-being and independence."
        ],
        pdfUrl: "",
        accent: "from-[var(--bright-lavender)] to-[var(--lavender-purple)]",
        accentColor: "#a06cd5",
    },
    {
        date: "Aug 2023 – 1 month",
        title: "Retail Sales Assistant",
        icon: Store,
        where: "Vendôme, France",
        text: ["Organized product displays, managed the stockroom, and welcomedand assisted customers on the shop floor."],
        pdfUrl: "/pdfs/DEL_CASTILLO_Clarisse_Cachan_EXE_P2027.pdf",
        accent: "from-[var(--lavender-purple)] to-[var(--deep-lilac-3)]",
        accentColor: "#6247aa",
    },
];
