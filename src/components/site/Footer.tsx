import Link from "next/link";

import { NAV, PHONE_DISPLAY, ROUTES, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer style={{ background: "var(--surface-ink)", color: "var(--text-on-ink)" }}>
      <div
        className="footer-grid"
        style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "72px clamp(20px, 5vw, 48px) 0" }}
      >
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "34px", lineHeight: 0.92 }}>
            Cardiología
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "11px",
              letterSpacing: ".3em",
              textTransform: "uppercase",
              marginTop: "12px",
              textIndent: ".15em",
            }}
          >
            Barrio <span style={{ color: "var(--clay-bright)" }}>·</span> Scarano
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "17px",
              color: "var(--clay-bright)",
              marginTop: "26px",
              maxWidth: "34ch",
              lineHeight: 1.4,
            }}
          >
            {SITE.tagline}
          </p>
        </div>

        <div>
          <div className="u-eyebrow" style={{ color: "var(--clay-bright)" }}>
            Consultorio
          </div>
          <address style={{ fontStyle: "normal", fontSize: "14px", lineHeight: 1.8, color: "rgba(246,243,237,.82)", marginTop: "14px" }}>
            <Link href={SITE.address.mapsLink} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
            </Link>
          </address>
          <nav style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "18px" }} aria-label="Secundaria">
            {NAV.filter((n) => n.href !== "/").map((n) => (
              <Link key={n.href} href={n.href} style={{ color: "rgba(246,243,237,.82)", textDecoration: "none", fontSize: "14px" }}>
                {n.label}
              </Link>
            ))}
            <Link href={ROUTES.turnos} style={{ color: "var(--clay-bright)", textDecoration: "none", fontSize: "14px" }}>
              Pedir turno
            </Link>
          </nav>
        </div>

        <div>
          <div className="u-eyebrow" style={{ color: "var(--clay-bright)" }}>
            Turnos
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.8, color: "rgba(246,243,237,.82)", marginTop: "14px" }}>
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
      </div>

      <div style={{ maxWidth: "var(--maxw)", margin: "40px auto 0", padding: "40px clamp(20px, 5vw, 48px)" }}>
        <div
          style={{
            borderTop: "1px solid rgba(246,243,237,.16)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "12px",
            color: "rgba(246,243,237,.6)",
          }}
        >
          <span>
            Tiempo <span style={{ color: "var(--clay-bright)" }}>·</span> Escucha <span style={{ color: "var(--clay-bright)" }}>·</span> Oficio{" "}
            <span style={{ color: "var(--clay-bright)" }}>·</span> Vínculo
          </span>
          <span>© 2026 · Cardiología Barrio · Scarano</span>
        </div>
      </div>
    </footer>
  );
}
