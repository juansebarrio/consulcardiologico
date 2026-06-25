import type { Metadata } from "next";

import { Callout } from "@/components/ui";
import { TurnosForm } from "@/components/site/TurnosForm";
import { PHONE_DISPLAY, ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pedir turno",
  description:
    "Pedí un turno por WhatsApp, sin vueltas. Contanos cómo te sentís y buscamos un día tranquilo. Consultorio en Martiniano Rodríguez 415, Bahía Blanca.",
  alternates: { canonical: ROUTES.turnos },
};

export default function TurnosPage() {
  return (
    <div>
      <section className="container" style={{ padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px) clamp(28px, 5vw, 40px)" }}>
        <div className="u-eyebrow" style={{ marginBottom: "20px" }}>
          Turnos
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6.5vw, 52px)", lineHeight: 1.05, maxWidth: "16ch" }}>Pedí un turno, sin vueltas.</h1>
        <p style={{ fontSize: "clamp(17px, 2.4vw, 19px)", color: "var(--text-muted)", maxWidth: "54ch", marginTop: "22px", lineHeight: 1.6 }}>
          Contanos cómo te sentís y buscamos un día tranquilo. Te respondemos por WhatsApp.
        </p>
      </section>

      <section className="container turnos-grid" style={{ padding: "0 clamp(20px, 5vw, 48px) clamp(64px, 9vw, 96px)" }}>
        <TurnosForm />

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ background: "var(--surface-ink)", color: "var(--text-on-ink)", borderRadius: "var(--radius-md)", padding: "30px 32px" }}>
            <div className="u-eyebrow" style={{ color: "var(--clay-bright)" }}>
              El consultorio
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(22px, 4vw, 26px)", marginTop: "14px", lineHeight: 1.2 }}>
              {SITE.address.line1}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(246,243,237,.78)", marginTop: "8px", lineHeight: 1.7 }}>{SITE.address.line2}</div>
            <div style={{ height: "1px", background: "rgba(246,243,237,.18)", margin: "22px 0" }} />
            <div style={{ fontSize: "14px", color: "rgba(246,243,237,.78)", lineHeight: 1.9 }}>
              WhatsApp · {PHONE_DISPLAY}
              <br />
              {SITE.schedule.map((s) => (
                <span key={s.quien}>
                  {s.dias} — {s.quien}
                  <br />
                </span>
              ))}
            </div>
          </div>

          <iframe
            title={`Mapa — ${SITE.address.line1}, ${SITE.address.city}`}
            src={SITE.address.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: "var(--radius-md)", display: "block" }}
          />

          <Callout variant="info">No hace falta que traigas mil estudios. Con lo que tengas alcanza para la primera consulta.</Callout>
        </div>
      </section>
    </div>
  );
}
