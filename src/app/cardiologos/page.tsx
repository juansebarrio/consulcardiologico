import type { Metadata } from "next";
import Image from "next/image";

import { Badge, Button, Callout } from "@/components/ui";
import { DOCTORS, ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Los cardiólogos",
  description:
    "Dr. Juan Pablo Barrio y Dra. Cynthia Scarano: dos cardiólogos en paridad, una misma manera de trabajar. Hospital Penna, ecocardiografía y seguimiento de cabecera en Bahía Blanca.",
  alternates: { canonical: ROUTES.cardiologos },
};

export default function CardiologosPage() {
  return (
    <div>
      <section className="container" style={{ padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px) clamp(40px, 6vw, 56px)" }}>
        <div className="u-eyebrow" style={{ marginBottom: "20px" }}>
          Los cardiólogos
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6.5vw, 52px)", lineHeight: 1.05, maxWidth: "18ch" }}>
          Dos cardiólogos, una manera de trabajar.
        </h1>
        <p style={{ fontSize: "clamp(17px, 2.4vw, 19px)", color: "var(--text-muted)", maxWidth: "56ch", marginTop: "22px", lineHeight: 1.6 }}>
          Se presentan en paridad: mismo peso, sin titular ni secundario. El día con el que te atendés define con quién — no lo señala la marca.
        </p>
      </section>

      {DOCTORS.map((d, i) => {
        const reversed = i % 2 === 1;
        return (
          <section
            key={d.slug}
            style={{ background: reversed ? "var(--surface-panel)" : "transparent", borderTop: "1px solid var(--border)" }}
          >
            <div
              className={"container doc-grid" + (reversed ? " reverse" : "")}
              style={{ padding: "clamp(48px, 7vw, 72px) clamp(20px, 5vw, 48px)" }}
            >
              <div className="doc-media">
                <div style={{ position: "relative", aspectRatio: "4 / 5", overflow: "hidden", border: "1px solid var(--border)", borderRadius: "var(--radius-md)" }}>
                  <Image
                    src={d.image}
                    alt={`Retrato de ${d.name}`}
                    fill
                    sizes="(max-width: 860px) 100vw, 480px"
                    style={{ objectFit: "cover", objectPosition: d.pos, filter: "saturate(.92)" }}
                  />
                </div>
              </div>
              <div className="doc-body">
                <h2 style={{ fontSize: "clamp(28px, 5vw, 36px)" }}>{d.name}</h2>
                <div style={{ margin: "14px 0 22px" }}>
                  <Badge variant="soft">{d.dias}</Badge>
                </div>
                <p style={{ fontSize: "17px", lineHeight: 1.7, color: "var(--text-body)", maxWidth: "46ch" }}>{d.bioLong}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {d.creds.map((c) => (
                    <li key={c} style={{ display: "flex", gap: "12px", fontSize: "14.5px", color: "var(--text-muted)" }}>
                      <span aria-hidden="true" style={{ color: "var(--accent)", fontWeight: 600 }}>
                        →
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: "26px", paddingTop: "22px", borderTop: "1px solid var(--border)" }}>
                  <div className="u-eyebrow" style={{ marginBottom: "8px" }}>
                    Sobre mí
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "clamp(19px, 3vw, 22px)",
                      lineHeight: 1.4,
                      color: "var(--text-strong)",
                      maxWidth: "40ch",
                    }}
                  >
                    «{d.yo}»
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="container" style={{ padding: "clamp(48px, 7vw, 64px) clamp(20px, 5vw, 48px) clamp(64px, 9vw, 96px)" }}>
        <Callout title="El punto medio es deliberado">
          Marca la paridad. Nunca se reemplaza por «y», ni se ordena por antigüedad o cargo.
        </Callout>
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <Button variant="primary" size="lg" href={ROUTES.turnos}>
            Pedir turno por WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}
