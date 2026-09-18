import { useRef, useEffect, useCallback } from "react";

let sharedContext: AudioContext | null = null;

function getAudioContext() {
  if (!sharedContext) {
    sharedContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }
  return sharedContext;
}

const audioBufferCache = new Map<string, AudioBuffer>();

export function Sound(src: string, volume = 0.4) {
  const bufferRef = useRef<AudioBuffer | null>(audioBufferCache.get(src) || null);
  const loadPromiseRef = useRef<Promise<AudioBuffer | null> | null>(null);
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const loadBuffer = useCallback(() => {
    if (bufferRef.current) return Promise.resolve(bufferRef.current);
    if (loadPromiseRef.current) return loadPromiseRef.current;

    const cachedBuffer = audioBufferCache.get(src);
    if (cachedBuffer) {
      bufferRef.current = cachedBuffer;
      return Promise.resolve(cachedBuffer);
    }


    const ctx = getAudioContext();

    loadPromiseRef.current = fetch(src)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decoded) => {

        audioBufferCache.set(src, decoded);
        bufferRef.current = decoded;


        return decoded;
      })

      .catch((err) => {
        loadPromiseRef.current = null;
        console.error("Erreur chargement audio:", err);
        return null;
      });
    return loadPromiseRef.current;
  }, [src]);

  const play = useCallback(async () => {
    const ctx = getAudioContext();
    const buffer = await loadBuffer();
    if (!buffer) return;

    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volumeRef.current;

    source.connect(gainNode).connect(ctx.destination);
    source.start(0);
  
}, [loadBuffer]);

return play;
}