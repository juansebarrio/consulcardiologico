import type { Metadata } from "next";

import { Accordion, Button } from "@/components/ui";
import { COMPROMISOS, PILARES, ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cómo trabajamos",
  description:
    "A contramano del modelo médico de siempre: pedimos solo los estudios necesarios, recetamos solo si hace falta y el seguimiento es de cabecera. Los cuatro pilares y los cuatro compromisos del consultorio.",
  alternates: { canonical: ROUTES.como },
};

export default function ComoTrabajamosPage() {
  return (
    <div>
      <section className="container" style={{ padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px) clamp(40px, 6vw, 56px)" }}>
        <div className="u-eyebrow" style={{ marginBottom: "20px" }}>
          Cómo trabajamos
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6.5vw, 52px)", lineHeight: 1.05, maxWidth: "20ch" }}>
          A contramano del modelo médico de siempre.
        </h1>
        <p style={{ fontSize: "clamp(17px, 2.4vw, 19px)", color: "var(--text-muted)", maxWidth: "58ch", marginTop: "22px", lineHeight: 1.6 }}>
          Donde la norma es pedir estudios de más, medicar de entrada y atender consultas sueltas, acá pedimos solo lo necesario, recetamos solo si
          hace falta, y la relación no se corta cuando termina el turno.
        </p>
      </section>

      {/* comparación */}
      <section className="container" style={{ padding: "0 clamp(20px, 5vw, 48px) clamp(56px, 8vw, 80px)" }}>
        <div className="hairline-grid">
          <div style={{ background: "var(--surface-panel)", padding: "34px 36px" }}>
            <div className="u-eyebrow">El modelo de siempre</div>
            <div style={{ fontSize: "16px", lineHeight: 2, color: "var(--text-muted)", marginTop: "14px" }}>
              Estudios de más
              <br />
              Medicar de entrada
              <br />
              Consultas sueltas
            </div>
          </div>
          <div style={{ background: "var(--paper)", padding: "34px 36px" }}>
            <div className="u-eyebrow" style={{ color: "var(--accent)" }}>
              Acá
            </div>
            <div style={{ fontSize: "16px", lineHeight: 2, color: "var(--text-strong)", marginTop: "14px", fontWeight: 500 }}>
              Solo lo necesario
              <br />
              Recetar si hace falta
              <br />
              Seguimiento de cabecera
            </div>
          </div>
        </div>
      </section>

      {/* pilares */}
      <section style={{ background: "var(--surface-panel)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "clamp(56px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
          <div className="u-eyebrow" style={{ marginBottom: "36px" }}>
            Los cuatro pilares
          </div>
          <div className="hairline-grid">
            {PILARES.map(([t, d], i) => (
              <div key={t} style={{ background: "var(--paper)", padding: "40px 38px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "var(--accent)" }}>{"0" + (i + 1)}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 32px)", color: "var(--text-strong)" }}>{t}</span>
                </div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)", marginTop: "16px" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* compromisos arcilla */}
      <section style={{ background: "var(--surface-clay)", color: "var(--text-on-clay)" }}>
        <div className="container" style={{ padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px)" }}>
          <div className="u-eyebrow" style={{ color: "var(--label-on-clay)", marginBottom: "40px" }}>
            Los cuatro compromisos clínicos
          </div>
          {COMPROMISOS.map((t, i) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "clamp(16px, 4vw, 32px)",
                padding: "26px 0",
                borderTop: "1px solid rgba(246,243,237,.28)",
                borderBottom: i === COMPROMISOS.length - 1 ? "1px solid rgba(246,243,237,.28)" : "none",
              }}
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(32px, 6vw, 46px)", color: "var(--blush)", width: "70px", flexShrink: 0, lineHeight: 0.9 }}>
                {"0" + (i + 1)}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(22px, 4vw, 32px)", lineHeight: 1.25 }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* faq */}
      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px)" }}>
        <div className="u-eyebrow" style={{ marginBottom: "28px" }}>
          Preguntas frecuentes
        </div>
        <Accordion
          defaultOpen={["q1"]}
          items={[
            { id: "q1", title: "¿Tengo que llevar estudios?", content: "Con lo que tengas alcanza para empezar. Si hace falta algo más, te lo decimos en la consulta." },
            { id: "q2", title: "¿Cómo saco un turno?", content: "Por WhatsApp. Te respondemos y buscamos juntos un día tranquilo para verte." },
            {
              id: "q3",
              title: "¿Con quién me atiendo?",
              content: "Depende del día: lunes, miércoles y viernes con el Dr. Barrio; martes y jueves con la Dra. Scarano. Los dos trabajan igual.",
            },
            {
              id: "q4",
              title: "¿Y después de la consulta?",
              content: "Seguimos. El seguimiento de cabecera es parte de cómo trabajamos: después del turno también estamos.",
            },
          ]}
        />
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <Button variant="primary" size="lg" href={ROUTES.turnos}>
            Pedir un turno
          </Button>
        </div>
      </section>
    </div>
  );
}
