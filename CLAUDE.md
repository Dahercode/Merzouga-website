# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for Merzouga desert tours built on Astro 5 with TypeScript, multilingual support (English, French, Spanish), and a booking system. Based on the Odyssey Theme framework with extensive customizations for tour content.

## Development Commands

### Local Development
```bash
cd frontend
npm install
npm run dev              # Dev server at http://localhost:3000
```

### Docker Environment
```bash
docker-compose up --build
# Astro dev: http://localhost:3000
# MailDev UI: http://localhost:1080 (SMTP on port 1025)
```

### Other Commands
```bash
npm run build            # Production build to frontend/dist
npm run preview          # Preview production build locally
npm run format           # Format with Prettier
npx astro-i18next generate  # Generate localized page copies after route changes
```

## Architecture

### Internationalization (i18n) System

**Key insight:** This project uses `astro-i18next` with a **file-based routing approach** where localized pages are physical copies in language subdirectories.

- **Config:** [frontend/astro-i18next.config.cjs](frontend/astro-i18next.config.cjs) defines locales (en/fr/es) and namespaces (common/home/tours/footer)
- **Translations:** JSON files in [frontend/public/locales/{locale}/{namespace}.json](frontend/public/locales/)
- **Page structure:**
  - Default locale (en): [frontend/src/pages/](frontend/src/pages/) (e.g., `index.astro`, `tours/index.astro`)
  - Other locales: [frontend/src/pages/{locale}/](frontend/src/pages/) (e.g., `fr/index.astro`, `es/tours/index.astro`)

**Workflow when adding/modifying routes:**
1. Create or update the default English page
2. Update translations in all locale JSON files
3. Run `npx astro-i18next generate` to create/update localized page copies
4. Verify all three languages have matching routes

### Tour Content System

Tours are **MDX files** in [frontend/src/pages/tours/posts/](frontend/src/pages/tours/posts/) using the [Post.astro](frontend/src/layouts/Post.astro) layout.

**MDX frontmatter structure:**
```yaml
---
layout: '../../../layouts/Post.astro'
title: 'Tour Title'
description: 'SEO description'
publishDate: 'YYYY-MM-DD'
featuredImage: '/assets/images/blog/...'
excerpt: 'Short summary'
price: 'From €X per person'
duration: 'X days / X nights'
tags:
  - 'Tag1'
  - 'Tag2'
---
```

**Important:** Tour MDX files can import and use Odyssey Theme components:
```jsx
import { Button } from '@components/odyssey-theme';
```

### Booking API Endpoint

**Location:** [frontend/src/pages/api/book.ts](frontend/src/pages/api/book.ts)

- **Prerender:** Disabled (`prerender = false`) - this is a server endpoint
- **Method:** POST only
- **Validation:** Requires `firstName`, `lastName`, `email`, `tour`, `people`, `phone`, `startDate`, `endDate`
- **Email:** Uses Nodemailer with environment-configured SMTP
- **Environment vars:** See [frontend/.env.example](frontend/.env.example)

### Component Architecture

**Odyssey Theme Components:** Available via [frontend/src/components/odyssey-theme.js](frontend/src/components/odyssey-theme.js)

Key component directories:
- `components/buttons/` - Button variants
- `components/cards/` - Card components
- `components/forms/` - Form and form fields
- `components/sections/` - Page sections (Hero, Features, etc.)
- `components/tours/` - Tour-specific components
- `components/theme-switcher/` - Theme switching UI

**Layouts:**
- [Base.astro](frontend/src/layouts/Base.astro) - Root layout with head/body structure
- [Page.astro](frontend/src/layouts/Page.astro) - Standard page layout
- [Post.astro](frontend/src/layouts/Post.astro) - Tour/blog post layout with metadata

### Configuration Files

- [frontend/src/config/settings.js](frontend/src/config/settings.js) - Site title, description, theme settings
- [frontend/src/config/nav.js](frontend/src/config/nav.js) - Navigation structure
- [frontend/src/config/footer.js](frontend/src/config/footer.js) - Footer configuration
- [frontend/astro.config.mjs](frontend/astro.config.mjs) - Astro + integrations config
- [frontend/astro-i18next.config.cjs](frontend/astro-i18next.config.cjs) - i18n configuration

## Important Patterns

### Translation Workflow
When adding translatable content:
1. Add English text to appropriate namespace in `public/locales/en/{namespace}.json`
2. Add French translation in `public/locales/fr/{namespace}.json`
3. Add Spanish translation in `public/locales/es/{namespace}.json`
4. Keep JSON structure identical across all three files

### Working with Tours
- New tour: Create MDX file in `tours/posts/` with proper frontmatter
- Images: Place in `frontend/public/assets/images/`
- Tags: Used for tour categorization and filtering
- Layout: Always use `Post.astro` layout with relative path from post location

### Email Testing (Local Development)
The Docker environment includes MailDev for catching all outgoing emails:
- All emails sent via the booking endpoint are captured
- View emails at http://localhost:1080
- No real emails are sent in local development

## Build & Deployment

- **Output:** Static site in [frontend/dist/](frontend/dist/)
- **Adapter:** Vercel (configured in [astro.config.mjs](frontend/astro.config.mjs))
- **SSR:** Only `/api/book` endpoint requires server mode; rest is static
- **Assets:** Hosted from [frontend/public/](frontend/public/)

## Notes

- This project is built on the Odyssey Theme by Jaydan Urwin (see [frontend/README.md](frontend/README.md))
- The main README is at the root level; frontend has its own theme documentation
- Node 18+ required (Node 20 LTS recommended)
- Package manager: npm (package-lock.json is the lockfile, though yarn also works)
