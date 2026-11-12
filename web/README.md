# Web personal de Pol

Vive en la carpeta `web/` del repo; en Vercel, Root Directory = `web`.

Next.js desplegado en Vercel. Viajes (con ruta, plan día a día, reservas, checklist, crónica y fotos),
proyectos, hazañas, cosas que me gustan y sobre mí.

## Cómo se añade contenido

Todo el contenido son archivos JSON dentro de `content/`, uno por elemento:

```
content/viaje/<slug>.json      → /viajes/<slug>
content/proyecto/<slug>.json   → /proyectos/<slug>
content/hazana/<slug>.json     → /hazanas
content/interes/<slug>.json    → /cosas
content/perfil/perfil.json     → portada y /sobre-mi
```

Los campos de cada tipo están en `lib/schema.ts`. Las fotos van en `public/fotos/` y se referencian como `/fotos/<archivo>`.

Tres formas de cambiar algo, todas acaban en un commit a `main` y Vercel redespliega solo:

1. Pedírselo a Claude.
2. El panel privado en `/admin` (necesita `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO` y `GITHUB_DIR=web` en Vercel).
3. Editar los archivos a mano.

## En local

```
npm install
cp .env.example .env.local   # pon una ADMIN_PASSWORD
npm run dev
```

Sin `GITHUB_TOKEN`, el panel escribe directamente en los archivos locales.
