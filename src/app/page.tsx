import Image from "next/image";

import { Badge, Button, Callout, Card } from "@/components/ui";
import { Asistente } from "@/components/site/Asistente";
import { HeroVideo } from "@/components/site/HeroVideo";
import { COMPROMISOS, DOCTORS, HERO_POSTER, HERO_VIDEO, ROUTES } from "@/lib/site";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        {HERO_VIDEO ? (
          <>
            <HeroVideo src={HERO_VIDEO} poster={HERO_POSTER} />
            <div className="hero-scrim" aria-hidden="true" />
          </>
        ) : null}
        <div
          className="container hero-content"
          style={{ padding: "clamp(56px, 9vw, 96px) clamp(20px, 5vw, 48px) clamp(56px, 8vw, 84px)" }}
        >
          <div style={{ width: "60px", height: "1.5px", background: "var(--accent)", marginBottom: "40px" }} />
          <h1 style={{ fontSize: "clamp(40px, 8vw, 72px)", lineHeight: 1.02, maxWidth: "15ch" }}>
            Cardiología con el tiempo que tu{" "}
            <span className="pulse-heart" style={{ fontStyle: "italic", color: "var(--accent)" }}>
              corazón
            </span>{" "}
            necesita.
          </h1>
          <p style={{ fontSize: "clamp(17px, 2.4vw, 20px)", lineHeight: 1.6, color: "var(--text-muted)", maxWidth: "52ch", marginTop: "28px" }}>
            Dos cardiólogos en el centro de Bahía Blanca. Atendemos sin apuro, pedimos solo lo necesario y te seguimos de cabecera a largo plazo.
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "40px", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" href={ROUTES.turnos}>
              Pedir turno por WhatsApp
            </Button>
            <Button variant="secondary" size="lg" href={ROUTES.como}>
              Cómo trabajamos
            </Button>
          </div>
        </div>
      </section>

      {/* COMPROMISOS */}
      <section style={{ background: "var(--surface-panel)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container" style={{ padding: "clamp(56px, 8vw, 80px) clamp(20px, 5vw, 48px)" }}>
          <div className="u-eyebrow" style={{ marginBottom: "36px" }}>
            Nuestros cuatro compromisos
          </div>
          <div className="hairline-grid">
            {COMPROMISOS.map((t, i) => (
              <div key={t} style={{ background: "var(--paper)", padding: "40px 38px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "34px", color: "var(--accent)", lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(21px, 3vw, 25px)", lineHeight: 1.28, color: "var(--text-strong)" }}>
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASISTENTE VIRTUAL (chat con IA) */}
      <Asistente />

      {/* CARDIÓLOGOS */}
      <section className="container" style={{ padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "clamp(27px, 4.5vw, 34px)" }}>Dos cardiólogos, una manera de trabajar.</h2>
          <Button variant="link" href={ROUTES.cardiologos}>
            Conocelos →
          </Button>
        </div>
        <div className="grid-2" style={{ gap: "32px" }}>
          {DOCTORS.map((d) => (
            <Card key={d.slug} variant="default" padding="0" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden" }}>
                <Image
                  src={d.image}
                  alt={`Retrato de ${d.name}`}
                  fill
                  sizes="(max-width: 760px) 100vw, 520px"
                  style={{ objectFit: "cover", objectPosition: d.pos, filter: "saturate(.92)" }}
                />
              </div>
              <div style={{ padding: "28px 30px 32px" }}>
                <h3 style={{ fontSize: "26px" }}>{d.name}</h3>
                <div style={{ marginTop: "10px" }}>
                  <Badge variant="soft">{d.dias}</Badge>
                </div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-muted)", marginTop: "16px" }}>{d.bioShort}</p>
              </div>
            </Card>
          ))}
        </div>
        <div style={{ marginTop: "28px" }}>
          <Callout title="Sin jerarquía, en paridad">
            Ninguno es el titular y el otro el secundario: tienen el mismo peso. El orden es alfabético por apellido, unidos por el punto.
          </Callout>
        </div>
      </section>

      {/* PILARES BAND */}
      <section style={{ background: "var(--surface-ink)", color: "var(--text-on-ink)" }}>
        <div className="container" style={{ padding: "clamp(56px, 9vw, 88px) clamp(20px, 5vw, 48px)", textAlign: "center" }}>
          <div className="u-eyebrow" style={{ color: "var(--clay-bright)" }}>
            Lo que nos guía
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(32px, 5.5vw, 46px)", marginTop: "20px", lineHeight: 1.2 }}>
            Tiempo <span style={{ color: "var(--clay-bright)" }}>·</span> Escucha <span style={{ color: "var(--clay-bright)" }}>·</span> Oficio{" "}
            <span style={{ color: "var(--clay-bright)" }}>·</span> Vínculo
          </div>
          <p style={{ fontSize: "17px", color: "rgba(246,243,237,.72)", maxWidth: "54ch", margin: "24px auto 0", lineHeight: 1.7 }}>
            La consulta dura lo que tiene que durar. Se atiende a la persona, no al estudio. Y la relación no termina cuando termina el turno.
          </p>
          <div style={{ marginTop: "36px" }}>
            <Button variant="primary" size="lg" href={ROUTES.turnos}>
              Pedir un turno
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
