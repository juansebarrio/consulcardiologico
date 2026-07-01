import Link from "next/link";

import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { ROUTES } from "@/lib/site";

/**
 * FAB de «Pedir turno» — botón flotante presente en todas las páginas.
 *
 * Apunta a /turnos: con JS, la intercepción global (TurnoModal) lo convierte en
 * el pop-up de 3 preguntas —un solo embudo, mensajes estructurados—; sin JS,
 * navega a la página. En clay de marca (no verde WhatsApp), server-safe.
 * z-index 30: por encima del contenido, por debajo del modal (100).
 */
export function WhatsAppFab() {
  return (
    <Link
      href={ROUTES.turnos}
      aria-label="Pedir turno por WhatsApp"
      className="wa-fab"
      style={{
        position: "fixed",
        right: "18px",
        bottom: "calc(18px + env(safe-area-inset-bottom))",
        zIndex: 30,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "var(--accent)",
        color: "var(--accent-contrast)",
        boxShadow: "var(--shadow-md)",
        textDecoration: "none",
      }}
    >
      <WhatsAppIcon size={26} />
    </Link>
  );
}
