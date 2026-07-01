"use client";

/**
 * Primitivas de UI — Cardiología Barrio · Scarano.
 * Portadas del manual de marca (components/ + ui_kits/sitio/_runtime.jsx).
 * Estilo inline sobre los tokens CSS del sistema («Carta»). Sin dependencias.
 */

import Link from "next/link";
import { useId, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  ReactNode,
} from "react";

/* ── Button ──────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  full?: boolean;
  /** Forma de píldora (borde totalmente redondeado), p. ej. dentro de barras pill. */
  pill?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  type = "button",
  disabled = false,
  full = false,
  pill = false,
  iconLeft = null,
  iconRight = null,
  children,
  onClick,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState(false);

  const sizes: Record<ButtonSize, CSSProperties> = {
    sm: { fontSize: "13px", padding: "8px 14px" },
    md: { fontSize: "15px", padding: "11px 20px" },
    lg: { fontSize: "16px", padding: "14px 26px" },
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: hover && !disabled ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--accent-contrast)",
    },
    secondary: {
      background: hover && !disabled ? "var(--panel)" : "transparent",
      color: "var(--text-strong)",
      borderColor: "var(--border-strong)",
    },
    ghost: {
      background: hover && !disabled ? "var(--panel)" : "transparent",
      color: "var(--text-strong)",
    },
    link: {
      background: "transparent",
      color: "var(--accent)",
      textDecoration: hover ? "underline" : "none",
      textUnderlineOffset: "3px",
    },
  };
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: ".01em",
    borderRadius: pill ? "var(--radius-pill)" : "var(--radius-md)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.45 : 1,
    transform: active && !disabled ? "translateY(1px)" : "none",
    boxShadow: focus ? "var(--ring)" : "none",
    outline: "none",
    transition:
      "background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease), transform var(--dur-fast) var(--ease)",
    ...(variant === "link" ? {} : sizes[size]),
    ...variants[variant],
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };
  const content = (
    <>
      {iconLeft}
      {children}
      {iconRight}
    </>
  );

  if (href && !disabled) {
    const external = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (external) {
      return (
        <a
          href={href}
          style={style}
          onClick={onClick}
          target={target}
          rel={rel}
          aria-label={ariaLabel}
          {...handlers}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} style={style} onClick={onClick} target={target} rel={rel} aria-label={ariaLabel} {...handlers}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      style={style}
      onClick={onClick}
      aria-label={ariaLabel}
      {...handlers}
    >
      {content}
    </button>
  );
}

/* ── Card ────────────────────────────────────────────────────────────────── */

type CardVariant = "default" | "panel" | "ink" | "plain";

interface CardProps {
  variant?: CardVariant;
  elevated?: boolean;
  interactive?: boolean;
  padding?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Card({
  variant = "default",
  elevated = false,
  interactive = false,
  padding = "var(--space-lg)",
  style = {},
  children,
}: CardProps) {
  const [h, setH] = useState(false);
  const variants: Record<CardVariant, CSSProperties> = {
    default: { background: "var(--surface-card)", border: "1px solid var(--border)", color: "var(--text-body)" },
    panel: { background: "var(--surface-panel)", border: "1px solid var(--border)", color: "var(--text-body)" },
    ink: { background: "var(--surface-ink)", border: "1px solid var(--surface-ink)", color: "var(--text-on-ink)" },
    plain: { background: "transparent", border: "1px solid transparent", color: "var(--text-body)" },
  };
  const st: CSSProperties = {
    borderRadius: "var(--radius-card)",
    padding,
    boxShadow: elevated || (interactive && h) ? "var(--shadow-md)" : "none",
    transform: interactive && h ? "translateY(-2px)" : "none",
    transition: "box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)",
    ...variants[variant],
    ...style,
  };
  const hover = interactive
    ? { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }
    : {};
  return (
    <div style={st} {...hover}>
      {children}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */

type BadgeVariant =
  | "neutral"
  | "accent"
  | "soft"
  | "success"
  | "warning"
  | "danger"
  | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  children?: ReactNode;
  style?: CSSProperties;
}

export function Badge({ variant = "neutral", size = "md", children, style = {} }: BadgeProps) {
  const v: Record<BadgeVariant, CSSProperties> = {
    neutral: { background: "var(--panel)", color: "var(--text-strong)", border: "1px solid var(--border)" },
    accent: { background: "var(--accent)", color: "var(--accent-contrast)", border: "1px solid var(--accent)" },
    soft: { background: "var(--blush)", color: "var(--clay-deep)", border: "1px solid var(--blush)" },
    success: { background: "transparent", color: "var(--success)", border: "1px solid var(--success)" },
    warning: { background: "transparent", color: "var(--warning)", border: "1px solid var(--warning)" },
    danger: { background: "transparent", color: "var(--danger)", border: "1px solid var(--danger)" },
    outline: { background: "transparent", color: "var(--text-strong)", border: "1px solid var(--border-strong)" },
  };
  const s: CSSProperties =
    size === "sm" ? { fontSize: "10.5px", padding: "2px 8px" } : { fontSize: "12px", padding: "3px 10px" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        letterSpacing: ".04em",
        borderRadius: "var(--radius-sm)",
        lineHeight: 1.4,
        ...s,
        ...v[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ── Callout ─────────────────────────────────────────────────────────────── */

type CalloutVariant = "accent" | "info" | "success" | "warning" | "danger";

interface CalloutProps {
  variant?: CalloutVariant;
  title?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Callout({ variant = "accent", title, children, style = {} }: CalloutProps) {
  const dotColors: Record<CalloutVariant, string> = {
    accent: "var(--accent)",
    info: "var(--ink-soft)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
  };
  const dot = dotColors[variant] || "var(--accent)";
  return (
    <div
      style={{
        background: "var(--surface-panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        padding: "18px 20px",
        display: "flex",
        gap: "14px",
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "26px",
          lineHeight: 1,
          color: dot,
          flexShrink: 0,
          marginTop: "-2px",
        }}
      >
        ·
      </span>
      <div>
        {title ? (
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              color: "var(--text-strong)",
              marginBottom: "4px",
            }}
          >
            {title}
          </div>
        ) : null}
        <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.65, color: "var(--text-body)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Accordion ───────────────────────────────────────────────────────────── */

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  style?: CSSProperties;
}

export function Accordion({ items, allowMultiple = false, defaultOpen = [], style = {} }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));
  const toggle = (id: string) =>
    setOpen((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        if (!allowMultiple) n.clear();
        n.add(id);
      }
      return n;
    });
  return (
    <div style={{ borderTop: "1px solid var(--border)", ...style }}>
      {items.map((it) => {
        const on = open.has(it.id);
        return (
          <div key={it.id} style={{ borderBottom: "1px solid var(--border)" }}>
            <button
              onClick={() => toggle(it.id)}
              aria-expanded={on}
              style={{
                appearance: "none",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "18px 2px",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "19px",
                color: "var(--text-strong)",
              }}
            >
              <span>{it.title}</span>
              <span
                aria-hidden="true"
                style={{
                  color: "var(--accent)",
                  fontSize: "20px",
                  lineHeight: 1,
                  transform: on ? "rotate(45deg)" : "none",
                  transition: "transform var(--dur) var(--ease)",
                }}
              >
                +
              </span>
            </button>
            {on ? (
              <div
                style={{
                  padding: "0 2px 20px",
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--text-body)",
                  maxWidth: "62ch",
                }}
              >
                {it.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ── Form fields ─────────────────────────────────────────────────────────── */

interface TextFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  type?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  full?: boolean;
  iconLeft?: ReactNode;
  autoComplete?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function TextField({
  label,
  hint,
  error,
  id,
  type = "text",
  value,
  placeholder,
  disabled = false,
  required = false,
  full = true,
  iconLeft = null,
  autoComplete,
  inputMode,
  onChange,
}: TextFieldProps) {
  const [focus, setFocus] = useState(false);
  const reactId = useId();
  const fid = id || reactId;
  const box: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--paper)",
    border: "1px solid " + (error ? "var(--danger)" : focus ? "var(--accent)" : "var(--border)"),
    borderRadius: "var(--radius-md)",
    padding: "10px 12px",
    boxShadow: focus ? "var(--ring)" : "none",
    opacity: disabled ? 0.5 : 1,
    transition: "border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease)",
  };
  return (
    <label
      htmlFor={fid}
      style={{ display: "flex", flexDirection: "column", gap: "6px", width: full ? "100%" : "auto", fontFamily: "var(--font-body)" }}
    >
      {label ? (
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
          {required ? (
            <>
              <span aria-hidden="true" style={{ color: "var(--accent)" }}> *</span>
              <span className="sr-only"> (obligatorio)</span>
            </>
          ) : null}
        </span>
      ) : null}
      <span style={box}>
        {iconLeft}
        <input
          id={fid}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          // 16px mínimo: por debajo, iOS Safari fuerza zoom al enfocar.
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "inherit", fontSize: "16px", color: "var(--text-strong)" }}
        />
      </span>
      {error ? (
        <span style={{ fontSize: "12px", color: "var(--danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

interface TextareaProps {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  full?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function Textarea({
  label,
  hint,
  error,
  id,
  value,
  placeholder,
  rows = 4,
  disabled = false,
  required = false,
  full = true,
  onChange,
}: TextareaProps) {
  const [focus, setFocus] = useState(false);
  const reactId = useId();
  const fid = id || reactId;
  return (
    <label
      htmlFor={fid}
      style={{ display: "flex", flexDirection: "column", gap: "6px", width: full ? "100%" : "auto", fontFamily: "var(--font-body)" }}
    >
      {label ? (
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
          {required ? (
            <>
              <span aria-hidden="true" style={{ color: "var(--accent)" }}> *</span>
              <span className="sr-only"> (obligatorio)</span>
            </>
          ) : null}
        </span>
      ) : null}
      <textarea
        id={fid}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          resize: "vertical",
          background: "var(--paper)",
          border: "1px solid " + (error ? "var(--danger)" : focus ? "var(--accent)" : "var(--border)"),
          borderRadius: "var(--radius-md)",
          padding: "10px 12px",
          font: "inherit",
          fontSize: "16px",
          lineHeight: 1.5,
          color: "var(--text-strong)",
          outline: "none",
          boxShadow: focus ? "var(--ring)" : "none",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color var(--dur) var(--ease)",
        }}
      />
      {error ? (
        <span style={{ fontSize: "12px", color: "var(--danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  id?: string;
  value?: string;
  placeholder?: string;
  options?: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  full?: boolean;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({
  label,
  hint,
  error,
  id,
  value,
  placeholder,
  options = [],
  disabled = false,
  required = false,
  full = true,
  onChange,
}: SelectProps) {
  const [focus, setFocus] = useState(false);
  const reactId = useId();
  const fid = id || reactId;
  return (
    <label
      htmlFor={fid}
      style={{ display: "flex", flexDirection: "column", gap: "6px", width: full ? "100%" : "auto", fontFamily: "var(--font-body)" }}
    >
      {label ? (
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-strong)" }}>
          {label}
          {required ? (
            <>
              <span aria-hidden="true" style={{ color: "var(--accent)" }}> *</span>
              <span className="sr-only"> (obligatorio)</span>
            </>
          ) : null}
        </span>
      ) : null}
      <span
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "var(--paper)",
          border: "1px solid " + (error ? "var(--danger)" : focus ? "var(--accent)" : "var(--border)"),
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? "var(--ring)" : "none",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color var(--dur) var(--ease)",
        }}
      >
        <select
          id={fid}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            font: "inherit",
            fontSize: "16px",
            color: "var(--text-strong)",
            padding: "10px 36px 10px 12px",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span style={{ position: "absolute", right: "12px", pointerEvents: "none", color: "var(--text-muted)", fontSize: "12px" }}>
          ▾
        </span>
      </span>
      {error ? (
        <span style={{ fontSize: "12px", color: "var(--danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

interface CheckboxProps {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
}

export function Checkbox({ label, checked, defaultChecked, disabled = false, onChange, id }: CheckboxProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const [foc, setFoc] = useState(false);
  const reactId = useId();
  const fid = id || reactId;
  const toggle = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternal(e.target.checked);
    if (onChange) onChange(e);
  };
  return (
    <label
      htmlFor={fid}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: "var(--font-body)",
        fontSize: "15px",
        color: "var(--text-strong)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        position: "relative",
      }}
    >
      <input
        id={fid}
        type="checkbox"
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        onChange={toggle}
        onFocus={() => setFoc(true)}
        onBlur={() => setFoc(false)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
      <span
        aria-hidden="true"
        style={{
          width: "18px",
          height: "18px",
          flexShrink: 0,
          borderRadius: "var(--radius-sm)",
          border: "1.5px solid " + (on ? "var(--accent)" : "var(--border-strong)"),
          background: on ? "var(--accent)" : "var(--paper)",
          color: "var(--accent-contrast)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: foc ? "var(--ring)" : "none",
          transition: "background var(--dur) var(--ease), border-color var(--dur) var(--ease)",
        }}
      >
        {on ? <span style={{ fontSize: "12px", lineHeight: 1 }}>✓</span> : null}
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
