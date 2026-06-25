"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Video de fondo del hero. En loop, mudo, decorativo (aria-hidden).
 * - Respeta prefers-reduced-motion: no reproduce si el usuario pidió menos movimiento.
 * - Si el archivo no existe todavía (onError), se oculta solo y queda el fondo papel.
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.pause();
    } else {
      void v.play().catch(() => {
        /* autoplay bloqueado: queda el poster / fondo papel */
      });
    }
  }, []);

  if (failed) return null;

  return (
    <video
      ref={ref}
      className="hero-video"
      src={src}
      poster={poster || undefined}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  );
}
