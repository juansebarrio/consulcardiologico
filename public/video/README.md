# Video del hero

Poné acá el video de fondo del hero de la home.

## Cómo cargarlo

1. Copiá tu archivo a esta carpeta con el nombre **`hero.mp4`**:
   `public/video/hero.mp4`
   → queda servido en `https://…/video/hero.mp4`
2. (Opcional) Una imagen de portada `hero-poster.jpg` que se ve mientras carga.
3. Si querés otro nombre/ruta, cambialo en `src/lib/site.ts` → `HERO_VIDEO` / `HERO_POSTER`.
4. Avisá y lo deployamos (o `git add public/video/hero.mp4 && git commit && git push`).

## Recomendaciones

- **Formato:** MP4 (códec **H.264**) — el más compatible. Opcional `.webm` (VP9/AV1) para mejor compresión.
- **Duración:** loop corto, ~10–20 s (el corte se nota poco si el primer y último frame se parecen).
- **Resolución:** 1080p o 720p alcanza para un fondo; priorizá **peso bajo** (idealmente < 3–5 MB).
- **Mudo:** el video va siempre sin sonido (autoplay lo exige).
- **Tono:** cálido, documental, encuadre tranquilo — el sitio le aplica un velo de papel y `saturate(.92)` para integrarlo a la marca. Evitá imágenes muy frías o saturadas.
- **Encuadre:** la columna de texto va a la izquierda; lo que se ve del video pesa más hacia la derecha. Dejá aire/poca acción en la zona izquierda.

> Si todavía no hay archivo, el hero muestra el fondo papel normal (no se rompe nada).
