import type { CSSProperties, ReactNode } from "react";

/**
 * Markdown mínimo y seguro para los mensajes del asistente.
 *
 * El modelo responde con Markdown —**negrita**, *cursiva*, `código`,
 * [enlaces](url), listas con «- » o «1. » y títulos «## »—; como las burbujas
 * mostraban el texto crudo, se veían los símbolos. Esto lo convierte en nodos
 * de React. Dos pasadas:
 *   1) bloque: separa líneas en párrafos, listas (orden./desorden.) y títulos.
 *   2) inline: dentro de cada bloque resuelve negrita/cursiva/código/enlaces.
 *
 * Nunca usa dangerouslySetInnerHTML —arma elementos de React, así el texto se
 * escapa solo y no hay riesgo de XSS—. Sin dependencias, al estilo del kit.
 */

/* ── Estilos ──────────────────────────────────────────────────────────────── */

const codeStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.92em",
  background: "var(--surface-panel)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "1px 5px",
};

const linkStyle: CSSProperties = {
  color: "var(--accent)",
  textUnderlineOffset: "2px",
};

const listStyle: CSSProperties = {
  margin: "4px 0",
  paddingLeft: "1.3em",
};

const liStyle: CSSProperties = { marginBottom: "2px" };

/* ── Pasada inline ────────────────────────────────────────────────────────── */

/** Solo dejamos pasar esquemas de enlace seguros. */
function safeHref(href: string): string | null {
  return /^(https?:|mailto:|tel:)/i.test(href.trim()) ? href.trim() : null;
}

/**
 * Tokeniza el texto de UNA línea/bloque en nodos: **negrita**, *cursiva*,
 * `código` y [enlaces](url). La negrita (**) va antes que la cursiva (*) en la
 * alternancia para que "**texto**" no se lea como cursiva vacía. El regex es
 * local (objeto nuevo por llamada): su `lastIndex` lo muta `exec` sin tocar
 * estado compartido.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const TOKEN =
    /(\*\*([^*]+?)\*\*)|(\*([^*\n]+?)\*)|(`([^`]+?)`)|(\[([^\]]+?)\]\(([^)\s]+?)\))/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;

  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const key = `${keyPrefix}-i${i++}`;

    if (m[1]) {
      nodes.push(<strong key={key}>{m[2]}</strong>);
    } else if (m[3]) {
      nodes.push(<em key={key}>{m[4]}</em>);
    } else if (m[5]) {
      nodes.push(
        <code key={key} style={codeStyle}>
          {m[6]}
        </code>,
      );
    } else if (m[7]) {
      const href = safeHref(m[9]);
      nodes.push(
        href ? (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            {m[8]}
          </a>
        ) : (
          m[0]
        ),
      );
    }

    last = m.index + m[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ── Pasada de bloque ─────────────────────────────────────────────────────── */

// No-globales: `.test()`/`.exec()` no mutan estado → seguros a nivel de módulo.
const HEADING = /^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/;
const ULI = /^\s*[-*+]\s+(.+)$/;
const OLI = /^\s*\d+[.)]\s+(.+)$/;

export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let b = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Línea en blanco: separador entre bloques (el espaciado lo dan los márgenes).
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Título «#…» → línea en negrita (no usamos <h*> para no chocar con los
    // estilos de encabezado del sitio).
    const h = HEADING.exec(line);
    if (h) {
      blocks.push(
        <div
          key={`b${b++}`}
          style={{ fontWeight: 700, color: "var(--text-strong)", margin: blocks.length ? "8px 0 2px" : "0 0 2px" }}
        >
          {renderInline(h[2], `b${b}`)}
        </div>,
      );
      i++;
      continue;
    }

    // Lista desordenada «- / * / +».
    if (ULI.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length) {
        const it = ULI.exec(lines[i]);
        if (!it) break;
        items.push(
          <li key={`li${i}`} style={liStyle}>
            {renderInline(it[1], `b${b}l${i}`)}
          </li>,
        );
        i++;
      }
      blocks.push(
        <ul key={`b${b++}`} style={listStyle}>
          {items}
        </ul>,
      );
      continue;
    }

    // Lista ordenada «1. / 1) ».
    if (OLI.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length) {
        const it = OLI.exec(lines[i]);
        if (!it) break;
        items.push(
          <li key={`li${i}`} style={liStyle}>
            {renderInline(it[1], `b${b}l${i}`)}
          </li>,
        );
        i++;
      }
      blocks.push(
        <ol key={`b${b++}`} style={listStyle}>
          {items}
        </ol>,
      );
      continue;
    }

    // Párrafo: junta líneas consecutivas «normales», separándolas con <br/>.
    const para: ReactNode[] = [];
    let firstLine = true;
    while (i < lines.length) {
      const l = lines[i];
      if (l.trim() === "" || HEADING.test(l) || ULI.test(l) || OLI.test(l)) break;
      if (!firstLine) para.push(<br key={`br${i}`} />);
      para.push(...renderInline(l, `b${b}p${i}`));
      firstLine = false;
      i++;
    }
    blocks.push(
      <p key={`b${b++}`} style={{ margin: blocks.length ? "6px 0 0" : 0 }}>
        {para}
      </p>,
    );
  }

  return <>{blocks}</>;
}
