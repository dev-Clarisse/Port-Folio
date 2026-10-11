import {
    Bot,
    Smartphone,
    BookOpen,
    Palette,
    MessageCircle,
    GraduationCap,
    Sparkles,
} from "lucide-react";
import { FaGithub } from 'react-icons/fa';
import "@/App.css";
import { Button } from "@/components/ui/button";

type Project = {
    title: string;
    subtitle: string;
    icon: typeof Bot;
    description: string;
    tags: string[];
    repo: string;
    accent: string;
};

const academicProjects: Project[] = [
    {
        title: "QuadGPT",
        subtitle: "EPF Hackathon",
        icon: Bot,
        description:
            "A self-hosted enterprise chatbot with local AI inference. Built with a Spring Boot API, a React + TypeScript frontend, PostgreSQL + pgvector, MinIO object storage and Ollama for local LLM execution — all orchestrated through Docker and Traefik.",
        tags: ["Java", "Spring Boot", "React", "TypeScript", "PostgreSQL", "Docker"],
        repo: "https://github.com/dev-Clarisse/QuadGPT",
        accent: "from-[var(--thistle)] to-[var(--wisteria-2)]",
    },
];

const personalProjects: Project[] = [
    {
        title: "widgetCitations",
        subtitle: "Android + REST API",
        icon: Smartphone,
        description:
            "A full-stack Android project made of two modules: a Spring Boot REST API serving random quotes from a PostgreSQL database, and a home screen widget that fetches and displays a new quote at a set interval.",
        tags: ["Java", "Spring Boot", "Android", "PostgreSQL", "Docker"],
        repo: "https://github.com/dev-Clarisse/widgetCitations",
        accent: "from-[var(--bright-lavender)] to-[var(--lavender-purple)]",
    },
    {
        title: "Pierre Del Castillo",
        subtitle: "Academic website",
        icon: BookOpen,
        description:
            "An academic portfolio website built for a mathematics teacher. It centralizes his teaching resources for higher education students (L1 to M1), organized by academic level and subject, with automatic deployment via GitHub Actions.",
        tags: ["HTML5", "CSS3", "Bootstrap 5", "GitHub Actions"],
        repo: "https://github.com/dev-Clarisse/SiteWeb-Pierre-Del-Castillo",
        accent: "from-[var(--wisteria-2)] to-[var(--bright-lavender)]",
    },
    {
        title: "Port-Folio",
        subtitle: "Personal website",
        icon: Palette,
        description:
            "My personal portfolio — a React 19 + TypeScript single-page app featuring animated 3D-inspired visuals, a dynamic cursor, smooth routing and dedicated sections for skills, experience, projects and challenges.",
        tags: ["React 19", "TypeScript", "Vite", "Tailwind", "Three.js"],
        repo: "https://github.com/dev-Clarisse/Port-Folio",
        accent: "from-[var(--lavender-purple)] to-[var(--deep-lilac-3)]",
    },
    {
        title: "chatbot_PracticeEnglish",
        subtitle: "Voice chatbot",
        icon: MessageCircle,
        description:
            "A small voice chatbot built to practice spoken English. It listens through the microphone, transcribes speech with Google Speech Recognition, queries the OpenAI API and replies out loud using text-to-speech.",
        tags: ["Python", "OpenAI API", "SpeechRecognition", "pyttsx3"],
        repo: "https://github.com/dev-Clarisse/chatbot_PracticeEnglish",
        accent: "from-[var(--pastel-petal)] to-[var(--lavender-purple)]",
    },
];

function ProjectCard({ project }: { project: Project }) {
    const { title, subtitle, icon: Icon, description, tags, repo, accent } = project;

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-(--wisteria-2)/50 bg-[#1a1025]/90 p-6 shadow-[0_0_24px_rgba(129,90,192,0.2)] transition duration-300 hover:-translate-y-1 hover:border-lilac-1100 hover:shadow-[0_0_30px_rgba(193,158,224,0.35)]">
            <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`} />

            <div className="mb-5 flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-black bg-lilac-950 text-lilac-1100 shadow-[0_0_18px_var(--lavender-purple)]">
                    <Icon size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                    <h3 className="truncate text-xl font-semibold text-lilac-100">
                        {title}
                    </h3>
                    {subtitle && (
                        <span className="text-xs font-semibold uppercase tracking-widest text-lilac-1100">
                            {subtitle}
                        </span>
                    )}
                </div>
            </div>

            <p className="mb-5 flex-1 leading-relaxed text-lilac-200">
                {description}
            </p>

            <ul className="mb-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <li
                        key={tag}
                        className="rounded-full border border-lilac-1100/40 bg-lilac-950/30 px-2.5 py-0.5 text-xs font-medium text-lilac-1100 backdrop-blur-sm"
                    >
                        {tag}
                    </li>
                ))}
            </ul>

            <div className="mt-auto flex justify-center">
                <Button
                    asChild
                    className="btn-glossy bg-lilac-950 text-base text-lilac-100 transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--color-lilac-400)]"
                >
                    <a
                        href={repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                    >
                        <FaGithub size={18} aria-hidden="true" />
                        <span>View on GitHub</span>
                    </a>
                </Button>
            </div>
        </article>
    );
}

function Projects() {
    return (
        <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 text-white sm:px-10">
            <header className="mx-auto mb-16 max-w-2xl text-center">
                <h1 className="mb-2 pt-11 text-4xl font-bold text-lilac-1000 sm:pt-8">
                    Projects
                </h1>
                <p className="mt-5 text-base leading-7 text-lilac-200">
                    A selection of what I have built — from academic hackathon work to
                    personal experiments, all open on GitHub.
                </p>
            </header>

            {/* ---------- Academic ---------- */}
            <div className="mb-20">
                <div className="mb-8 flex items-center gap-3">
                    <GraduationCap size={22} className="shrink-0 text-lilac-1100" />
                    <h2 className="text-2xl font-semibold text-lilac-100">
                        Academic Projects
                    </h2>
                    <span className="h-px flex-1 bg-linear-to-r from-lilac-1100/60 to-transparent" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    {academicProjects.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>
            </div>

            {/* ---------- Personal ---------- */}
            <div>
                <div className="mb-8 flex items-center gap-3">
                    <Sparkles size={22} className="shrink-0 text-lilac-1100" />
                    <h2 className="text-2xl font-semibold text-lilac-100">
                        Personal Projects
                    </h2>
                    <span className="h-px flex-1 bg-linear-to-r from-lilac-1100/60 to-transparent" />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    {personalProjects.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;
