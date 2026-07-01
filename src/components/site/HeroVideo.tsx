"use client";

import { useEffect, useRef, useState } from "react";
import { preload as preloadResource } from "react-dom";

/**
 * Video de fondo del hero. En loop, mudo, decorativo (aria-hidden).
 * - El poster es el candidato LCP: se precarga con prioridad alta.
 * - El MP4 (~260KB) NO se baja hasta después de hidratar (preload="none" en
 *   SSR): quien tiene reduced-motion, Save-Data activado o rebota antes de
 *   hidratar nunca lo descarga, y el video no compite con fuentes/JS en la
 *   ventana de LCP.
 * - Si el archivo no existe todavía (onError), se oculta solo y queda el papel.
 */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  if (poster) preloadResource(poster, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.pause();
      return;
    }
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return; // modo ahorro de datos: queda el poster
    v.preload = "auto";
    void v.play().catch(() => {
      /* autoplay bloqueado: queda el poster / fondo papel */
    });
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
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
    />
  );
}
