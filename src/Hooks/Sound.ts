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
  const volumeRef = useRef(volume);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (audioBufferCache.has(src)) {
      bufferRef.current = audioBufferCache.get(src)!;
      return;
    }

    let cancelled = false;
    const ctx = getAudioContext();

    fetch(src)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decoded) => {
        if (!cancelled) {
          audioBufferCache.set(src, decoded);
          bufferRef.current = decoded;
        }
      })
      .catch((err) => console.error("Erreur chargement audio:", err));

    return () => {
      cancelled = true;
    };
  }, [src]);

  const play = useCallback(() => {
    const ctx = getAudioContext();
    const buffer = bufferRef.current;
    if (!buffer) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volumeRef.current;

    source.connect(gainNode).connect(ctx.destination);
    source.start(0);
  }, []);

  return play;
}