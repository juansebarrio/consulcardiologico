import type { CSSProperties } from "react";

/**
 * Isotipo de marca — el punto medio «·» aislado dentro de un círculo de borde fino.
 * Significa paridad y pausa; sirve de sello. Fiel a guidelines/brand-symbol del manual
 * (círculo 96px, borde 2px ink, «·» Spectral ~0.6× en arcilla). Tamaño mínimo 16px.
 */
export function Isotipo({
  size = 96,
  style,
  title = "Isotipo Barrio · Scarano: el punto medio",
}: {
  size?: number;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <span
      role="img"
      aria-label={title}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        border: `${Math.max(1.5, size * 0.021)}px solid var(--ink)`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: size * 0.6,
          color: "var(--accent)",
          lineHeight: 0,
        }}
      >
        ·
      </span>
    </span>
  );
}
