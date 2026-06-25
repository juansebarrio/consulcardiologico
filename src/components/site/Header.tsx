"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui";
import { NAV, ROUTES } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkStyle = (active: boolean): CSSProperties => ({
    appearance: "none",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    fontWeight: 600,
    color: active ? "var(--text-strong)" : "var(--text-muted)",
    padding: "6px 2px",
    borderBottom: "2px solid " + (active ? "var(--accent)" : "transparent"),
    textDecoration: "none",
    transition: "color var(--dur) var(--ease)",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "color-mix(in oklch, var(--paper) 86%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--maxw)",
          margin: "0 auto",
          padding: "13px clamp(20px, 5vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <Link href={ROUTES.home} style={{ textAlign: "left", lineHeight: 1, textDecoration: "none" }} aria-label="Cardiología Barrio · Scarano — Inicio">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "23px", lineHeight: 0.9, color: "var(--text-strong)" }}>
            Cardiología
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "9px",
              letterSpacing: ".26em",
              textTransform: "uppercase",
              marginTop: "5px",
              color: "var(--text-strong)",
            }}
          >
            Barrio <span style={{ color: "var(--accent)" }}>·</span> Scarano
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <nav id="site-nav" className="site-nav" data-open={open ? "true" : "false"}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                style={linkStyle(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}
            <Button size="sm" href={ROUTES.turnos} onClick={() => setOpen(false)}>
              Pedir turno
            </Button>
          </nav>

          <button
            type="button"
            className="site-burger"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" style={{ fontSize: "18px", lineHeight: 1 }}>
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
