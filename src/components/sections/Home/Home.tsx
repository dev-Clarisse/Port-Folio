import { CircleUserRound, BookOpen, Zap, Sparkles, FolderGit2, BriefcaseBusiness, Swords } from "lucide-react";
import '@/App.css';
import FlowersGL from "@/components/3D/FlowersGL";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sound } from "@/Hooks/Sound";

function Home() {
    const navigate = useNavigate();
    const playClick = Sound("/sounds/clic.mp3");

    const navItems = [
        { label: "About me", icon: CircleUserRound, path: "/about-me" },
        { label: "Academic", icon: BookOpen, path: "/academic" },
        { label: "Skills", icon: Zap, path: "/skills" },
        { label: "Experiences", icon: Sparkles, path: "/experiences" },
        { label: "Projects", icon: FolderGit2, path: "/projects" },
        { label: "Professional project", icon: BriefcaseBusiness, path: "/professional-project" },
        { label: "Challenges", icon: Swords, path: "/challenges" },
    ];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">

           
            <div className="absolute left-[4%] top-1/2 z-0 flex h-[min(65vh,450px)] w-[min(44vw,480px)] -translate-y-1/2 items-center justify-center">
                <FlowersGL />
            </div>

            <h1 className="neon citation relative z-10 font-citation text-lilac-950 text-center my-6 -mt-11 text-2xl md:text-3xl max-w-2xl">
                ❝It takes a whole lifetime to learn how to live.❞
            </h1>

            <div className="flex flex-nowrap justify-center gap-3 max-w-4xl z-10 mt-48 translate-x-36 ">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.path}
                            onClick={() => {
                                playClick();
                                navigate(item.path);
                            }}
                            className="btn-glossy transition-all duration-300 hover:drop-shadow-[0_0_20px_var(--color-lilac-400)] flex items-center gap-2"
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