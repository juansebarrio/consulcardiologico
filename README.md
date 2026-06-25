# Cardiología Barrio · Scarano

Sitio web del consultorio de cardiología de los Dres. **Juan Pablo Barrio** y **Cynthia Scarano**, en el centro de Bahía Blanca.

> Cardiología con el tiempo que tu corazón necesita.

Construido a partir del manual de marca «Carta» (registro editorial cálido): papel crema, tinta cálida, un único acento arcilla y el punto medio «·» como símbolo. Tipografías **Spectral** (la voz) + **Hanken Grotesk** (el sistema).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (base) + sistema de diseño propio por tokens CSS (estilos inline sobre variables)
- Fuentes auto-hospedadas con `next/font/google`
- Imágenes con `next/image`

## Páginas

| Ruta | Contenido |
|---|---|
| `/` | Home — hero, cuatro compromisos, los dos cardiólogos, pilares |
| `/cardiologos` | Los cardiólogos — perfiles en paridad |
| `/como-trabajamos` | Cómo trabajamos — pilares, compromisos clínicos, FAQ |
| `/turnos` | Turnos — formulario que abre WhatsApp + mapa del consultorio |

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm start        # servir el build
```

## ⚠️ Antes de publicar — datos a completar

Los datos de contacto son **placeholders del manual** y se cambian en **un solo lugar**:
`src/lib/site.ts`

- `WHATSAPP_E164` — número de WhatsApp real (formato `549` + área + número, sin `+`).
- `PHONE_DISPLAY` — cómo se muestra el teléfono.
- `SITE.url` — dominio de producción (usado en metadata, OpenGraph, sitemap y robots).

La dirección (Martiniano Rodríguez 415, Bahía Blanca), los horarios y los datos de los
médicos también viven en `src/lib/site.ts`.

## Estructura

```
src/
  app/                 layout, páginas, globals.css, icon.svg, opengraph-image, sitemap, robots
  components/
    ui/                primitivas de marca (Button, Card, Badge, Callout, Accordion, form fields)
    site/              Header, Footer, TurnosForm
  lib/site.ts          configuración central (contacto, médicos, horarios, navegación)
public/doctores/       retratos de los médicos
```

## Deploy en Vercel

El proyecto está listo para `vercel`/`vercel --prod`. Recordá setear `SITE.url` y los datos de
contacto reales antes de promover a producción.
