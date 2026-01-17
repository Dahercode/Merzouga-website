# Merzouga Tours Website

Marketing site for Merzouga desert tours built with Astro 5, TypeScript, and `astro-i18next` for multilingual content (English, French, Spanish). Includes a booking endpoint backed by Nodemailer and a Docker setup with MailDev for local email testing.

## Stack & Structure
- Astro 5 static output with Vercel adapter (`frontend/astro.config.mjs`)
- Internationalization via `astro-i18next` (`frontend/astro-i18next.config.cjs`, translations in `frontend/public/locales/{en,fr,es}`)
- Content + layouts in `frontend/src` (pages, layouts, components, MDX content under `content/`)
- Booking API at `frontend/src/pages/api/book.ts` using environment-driven SMTP config
- Docker dev workflow (`Dockerfile.dev`, `docker-compose.yml`) with MailDev (UI on `:1080`, SMTP on `:1025`)

## Prerequisites
- Node 18+ (20 LTS recommended)
- npm 10+ (lockfile is `package-lock.json`; Yarn also works and is used in the Dockerfile)

## Quick Start (local)
```bash
cd frontend
npm install          # or yarn install
npm run dev          # runs astro dev --host --port 3000
```

Useful scripts:
- `npm run dev` – start dev server on http://localhost:3000
- `npm run build` – static build to `frontend/dist`
- `npm run preview` – serve the production build locally
- `npm run format` – format with Prettier/Prettier-Astro

## I18n Workflow
- Translation files live in `frontend/public/locales/{locale}/{namespace}.json` (namespaces: `common`, `home`, `tours`, `footer`).
- Configuration (locales, namespaces, route mapping) is in `frontend/astro-i18next.config.cjs`.
- After adding pages or updating route mappings, generate localized page copies with the CLI:
  ```bash
  cd frontend
  npx astro-i18next generate
  ```
- Use `localizePath`/`localizeUrl` helpers and `LanguageSelector`/`HeadHrefLangs` components to keep navigation and SEO language-aware.

## Environment Variables (booking email)
Set these in `frontend/.env` (or your hosting dashboard). Example:
```env
BOOKING_MAIL_TO=you@example.com
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
SMTP_FROM="Merzouga Tours <no-reply@example.com>"
```
Run MailDev locally via Docker (below) to capture emails without a real SMTP server.

## Docker Dev Environment
```bash
docker-compose up --build
```
- Astro dev: http://localhost:3000
- MailDev UI: http://localhost:1080 (SMTP on 1025)

## Deployment
- Build with `npm run build`; static assets land in `frontend/dist`.
- The project ships with the Vercel adapter and can be deployed to any static-friendly host (Vercel, Netlify, S3/CloudFront, etc.). Serve `dist/` as the site root.

## Contributing Notes
- Keep translations in sync across `en`, `fr`, `es` before shipping.
- Run `npm run format` before committing.
- If you add new routes, re-run `npx astro-i18next generate` to scaffold localized pages.
