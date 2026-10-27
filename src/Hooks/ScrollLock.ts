import { useEffect } from "react";

// Bloque le scroll uniquement quand l'écran est assez grand pour tout afficher
const LOCK_QUERY = "(min-width: 768px) and (min-height: 700px)";

export function useScrollLock() {
  useEffect(() => {
    const media = window.matchMedia(LOCK_QUERY);
    const originalBody = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;

    const apply = () => {
      document.body.style.overflow = media.matches ? "hidden" : originalBody;
      document.documentElement.style.overflow = media.matches ? "hidden" : originalHtml;
    };

    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      document.body.style.overflow = originalBody;
      document.documentElement.style.overflow = originalHtml;
    };
  }, []);
}
