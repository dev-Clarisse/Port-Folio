import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";
import { Sound } from "@/Hooks/Sound";

const STORAGE_KEY = "music-muted";

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function play(audio: HTMLAudioElement | null) {
  if (!audio) return;
  audio.volume = 0.3;
  audio.play().catch((err) => console.log("Lecture bloquée :", err));
}

export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playClick = Sound("/sounds/clic.mp3");
  const [muted, setMuted] = useState(readMuted);

  // Ref lue par l'écouteur de première interaction (qui ne voit pas l'état React à jour)
  const mutedRef = useRef(muted);

  // Les navigateurs bloquent l'autoplay : la musique démarre au premier clic ou à la première touche
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!mutedRef.current) play(audioRef.current);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggle = () => {
    const next = !muted;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Préférence non sauvegardée (navigation privée…) : sans conséquence
    }

    if (next) {
      audioRef.current?.pause();
    } else {
      play(audioRef.current);
    }
    playClick();
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/chill.mp3" loop preload="none" />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={!muted}
        aria-label={muted ? "Turn the music on" : "Turn the music off"}
        title={muted ? "Turn the music on" : "Turn the music off"}
        className={`fixed top-4 right-16 z-40 md:top-6 md:right-6 md:z-50 flex size-8 md:size-10 items-center justify-center rounded-full border border-(--wisteria-2)/40 bg-[#1a1025]/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:border-lilac-1100 hover:shadow-[0_0_20px_rgba(193,158,224,0.35)] ${muted ? "text-lilac-300/60" : "text-lilac-300 drop-shadow-[0_0_6px_var(--color-lilac-500)]"
          }`}
      >
        <span className="relative flex items-center justify-center">
          <Music className="size-4 md:size-5" aria-hidden="true" />
          {/* Barre oblique quand la musique est coupée */}
          {muted && (
            <span
              aria-hidden="true"
              className="absolute h-0.5 w-6 md:w-7 -rotate-45 rounded-full bg-lilac-1100 shadow-[0_0_4px_var(--color-lilac-1100)]"
            />
          )}
        </span>
      </button>
    </>
  );
}
