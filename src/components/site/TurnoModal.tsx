"use client";

/**
 * Pop-up de «Pedir turno» — Cardiología Barrio · Scarano.
 *
 * Por ahora los turnos se coordinan por WhatsApp. En vez de mandar a una página,
 * cualquier botón/enlace «Pedir turno» (los que apuntan a `/turnos`) abre este
 * modal con tres preguntas rápidas —nombre, preferencia de horario y obra social
 * o particular— y deja el mensaje pre-escrito listo para enviar por WhatsApp.
 *
 * Cómo se dispara: se monta UNA vez en el layout y escucha los clics a enlaces
 * internos hacia `/turnos` en fase de captura. Llama solo `preventDefault()`, así
 * el `<Link>` de Next ve `defaultPrevented` y NO navega (ver link.js), pero los
 * demás handlers del click —p. ej. cerrar el menú mobile del header— sí corren.
 * Si no hay JS, el enlace cae a la página `/turnos` de siempre (fallback).
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, FormEvent, ReactNode } from "react";

import { Button, TextField } from "@/components/ui";
import { buildTurnoWhatsApp, type TurnoInput } from "@/lib/asistente";
import { ROUTES, whatsappLink } from "@/lib/site";

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

/* Etiqueta + control, al mismo registro que los campos del kit (ui/index.tsx). */
function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-body)" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-strong)" }}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" style={{ color: "var(--accent)" }}> *</span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        ) : null}
      </span>
      {children}
    </div>
  );
}

/* Control segmentado (2–3 opciones) accesible como grupo de radios. */
function Segmented({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: "8px" }}
    >
      {options.map((o) => {
        const active = value === o.value;
        const st: CSSProperties = {
          appearance: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 600,
          padding: "11px 12px",
          borderRadius: "var(--radius-md)",
          border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
          background: active ? "var(--accent)" : "var(--paper)",
          color: active ? "var(--accent-contrast)" : "var(--text-strong)",
          transition:
            "background var(--dur) var(--ease), border-color var(--dur) var(--ease), color var(--dur) var(--ease)",
        };
        return (
          <button key={o.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(o.value)} style={st}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

type Preferencia = "" | "manana" | "tarde";
type Cobertura = "" | "os" | "particular";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TurnoModal() {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [preferencia, setPreferencia] = useState<Preferencia>("");
  const [cobertura, setCobertura] = useState<Cobertura>("");
  const [obra, setObra] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  function abrir() {
    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    setOpen(true);
  }

  function cerrar() {
    setOpen(false);
    setNombre("");
    setPreferencia("");
    setCobertura("");
    setObra("");
  }

  // Intercepta los clics a enlaces internos hacia /turnos → abre el modal.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = e.target as Element | null;
      const anchor = el?.closest?.("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (!anchor.getAttribute("href")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname !== ROUTES.turnos) return;
      // Solo prevenimos la navegación: el <Link> de Next ve defaultPrevented y
      // no navega, pero el resto de handlers del click siguen corriendo.
      e.preventDefault();
      abrir();
    }
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  // Mientras está abierto: bloquea scroll, foco inicial, Escape y trampa de foco.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
    }, 0);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar();
        return;
      }
      if (e.key !== "Tab") return;
      const box = dialogRef.current;
      if (!box) return;
      const items = Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !box.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !box.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown, true);
      window.clearTimeout(focusTimer);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  const obraValor = cobertura === "particular" ? "Particular" : obra.trim();
  const puedeEnviar =
    nombre.trim() !== "" && preferencia !== "" && (cobertura === "particular" || (cobertura === "os" && obra.trim() !== ""));

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!puedeEnviar) return;
    const data: TurnoInput = {
      nombre: nombre.trim(),
      obraSocial: obraValor,
      preferencia: preferencia === "manana" ? "Por la mañana" : "Por la tarde",
    };
    window.open(whatsappLink(buildTurnoWhatsApp(data)), "_blank", "noopener,noreferrer");
    cerrar();
  }

  if (!open || typeof document === "undefined") return null;

  const overlay = (
    <div
      className="turno-overlay"
      onClick={cerrar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "color-mix(in oklch, var(--ink) 52%, transparent)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        overflowY: "auto",
      }}
    >
      <div
        ref={dialogRef}
        className="turno-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="turno-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "440px",
          background: "var(--paper)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: "clamp(24px, 5vw, 34px)",
        }}
      >
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            appearance: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: 1,
            color: "var(--text-muted)",
            padding: "4px",
          }}
        >
          ✕
        </button>

        <div className="u-eyebrow" style={{ color: "var(--accent)", marginBottom: "10px" }}>
          Pedir turno
        </div>
        <h2 id="turno-modal-title" style={{ fontSize: "clamp(23px, 4.5vw, 28px)", lineHeight: 1.12 }}>
          Tres datos y lo seguimos por WhatsApp.
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--text-muted)", marginTop: "10px", lineHeight: 1.6 }}>
          Te dejamos el mensaje listo para enviar. Coordinamos día y hora por ahí.
        </p>

        <form onSubmit={enviar} style={{ display: "flex", flexDirection: "column", gap: "18px", marginTop: "22px" }}>
          <TextField
            label="Tu nombre"
            placeholder="Cómo te llamás"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <Field label="¿Qué preferís?" required>
            <Segmented
              label="¿Qué preferís?"
              value={preferencia}
              onChange={(v) => setPreferencia(v as Preferencia)}
              options={[
                { value: "manana", label: "Mañana" },
                { value: "tarde", label: "Tarde" },
              ]}
            />
          </Field>

          <Field label="¿Obra social o particular?" required>
            <Segmented
              label="¿Obra social o particular?"
              value={cobertura}
              onChange={(v) => setCobertura(v as Cobertura)}
              options={[
                { value: "os", label: "Obra social" },
                { value: "particular", label: "Particular" },
              ]}
            />
            {cobertura === "os" ? (
              <div style={{ marginTop: "10px" }}>
                <TextField
                  label=""
                  placeholder="¿Cuál? Ej.: OSDE, IOMA, Swiss Medical…"
                  value={obra}
                  onChange={(e) => setObra(e.target.value)}
                  required
                />
              </div>
            ) : null}
          </Field>

          <div style={{ marginTop: "4px" }}>
            <Button type="submit" variant="primary" size="lg" full disabled={!puedeEnviar} iconLeft={<WhatsAppIcon />}>
              Enviar por WhatsApp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
