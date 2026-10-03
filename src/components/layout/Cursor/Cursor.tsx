import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);

  // Pointeur précis (souris/trackpad) uniquement : pas de curseur sur tactile
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );

  useEffect(() => {
    if (!enabled) return;

    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement;
      setIsPointer(!!target.closest("a, button, [role='button'], input, textarea"));
    };

    const animate = () => {
      posX += (mouseX - posX) * 0.25;
      posY += (mouseY - posY) * 0.25;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${posX}px`;
        cursorRef.current.style.top = `${posY}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={cursorRef}
      className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-200 ease-out ${
        isPointer ? "scale-125" : "scale-100"
      } {visible ? "opacity-100" : "opacity-0"}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        className="animate-[spin_8s_linear_infinite]"
        style={{
          filter: isPointer
            ? "drop-shadow(0 0 6px var(--color-lilac-400)) drop-shadow(0 0 14px var(--color-lilac-500))"
            : "drop-shadow(0 0 4px var(--color-lilac-400))",
        }}
      >
        <defs>
          <linearGradient id="cursorFlowerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-lilac-200)" />
            <stop offset="100%" stopColor="var(--color-lilac-500)" />
          </linearGradient>
        </defs>

        {/* 5 pétales générés par rotation */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="14"
            cy="7"
            rx="4"
            ry="7"
            fill="url(#cursorFlowerGradient)"
            transform={`rotate(${angle} 14 14)`}
          />
        ))}

        {/* Coeur de la fleur */}
        <circle cx="14" cy="14" r="3" fill="var(--color-lilac-100)" />
      </svg>
    </div>
  );
}