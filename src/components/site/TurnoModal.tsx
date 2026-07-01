"use client";

/**
 * Pop-up de «Pedir turno» — Cardiología Barrio · Scarano.
 *
 * Por ahora los turnos se coordinan por WhatsApp. En vez de mandar a una página,
 * cualquier botón/enlace «Pedir turno» (los que apuntan a `/turnos`) abre este
 * modal con tres preguntas rápidas —nombre, preferencia de horario y obra social
 * o particular— y deja el mensaje pre-escrito listo para enviar por WhatsApp.
 * Los campos viven en TurnoFields (compartidos con el formulario de /turnos).
 *
 * Cómo se dispara: se monta UNA vez en el layout y escucha los clics a enlaces
 * internos hacia `/turnos` en fase de captura. Llama solo `preventDefault()`, así
 * el `<Link>` de Next ve `defaultPrevented` y NO navega (ver link.js), pero los
 * demás handlers del click —p. ej. cerrar el menú mobile del header— sí corren.
 * Si no hay JS, el enlace cae a la página `/turnos` de siempre (fallback).
 *
 * En mobile se presenta como bottom sheet (ver .turno-dialog en globals.css).
 * Cerrarlo NO borra lo escrito: solo se resetea tras enviar.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FormEvent } from "react";

import { Button } from "@/components/ui";
import { WhatsAppIcon } from "@/components/site/WhatsAppIcon";
import { TurnoFields, turnoListo, type Cobertura, type Preferencia } from "@/components/site/TurnoFields";
import { buildTurnoWhatsApp, type TurnoInput } from "@/lib/asistente";
import { ROUTES, whatsappLink } from "@/lib/site";

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

  // Cerrar NO borra lo escrito: un tap accidental fuera del diálogo no debe
  // costarle el pedido a medias. Solo se limpia tras enviar (reset).
  function cerrar() {
    setOpen(false);
  }

  function reset() {
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
      // Autofocus del input solo con mouse: en touch el teclado taparía las
      // preguntas. En touch enfocamos el diálogo (mantiene la trampa de foco).
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (fine) {
        dialogRef.current?.querySelector<HTMLElement>("input")?.focus();
      } else {
        dialogRef.current?.focus();
      }
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

  const { valido: puedeEnviar, obraValor } = turnoListo(nombre, preferencia, cobertura, obra);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!puedeEnviar) return;
    const data: TurnoInput = {
      nombre: nombre.trim(),
      obraSocial: obraValor,
      preferencia: preferencia === "manana" ? "Por la mañana" : "Por la tarde",
    };
    const url = whatsappLink(buildTurnoWhatsApp(data));
    // In-app browsers (Instagram/Facebook) suelen bloquear window.open:
    // si lo tragan, navegamos directo para no perder el handoff.
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      window.location.href = url;
      return;
    }
    reset();
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
        tabIndex={-1}
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
          outline: "none",
        }}
      >
        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            appearance: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: 1,
            color: "var(--text-muted)",
            width: "44px",
            height: "44px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
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
          <TurnoFields
            nombre={nombre}
            onNombre={setNombre}
            preferencia={preferencia}
            onPreferencia={setPreferencia}
            cobertura={cobertura}
            onCobertura={setCobertura}
            obra={obra}
            onObra={setObra}
          />

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
