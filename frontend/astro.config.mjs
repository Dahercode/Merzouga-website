import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import lit from '@astrojs/lit';
import astroI18next from 'astro-i18next';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  site: 'https://www.truemoroccotours.com',

  // Add renderers to the config
  integrations: [
    sitemap({
      // Generate hreflang alternate links for each locale in the sitemap
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          fr: 'fr',
          es: 'es',
        },
      },
    }),
    mdx(),
    lit(),
    icon(),
    astroI18next(),
  ],

  // Output directory for the built site
  output: 'static',

  adapter: vercel(),

  vite: {
    server: {
      watch: {
        // In Docker on Windows/macOS, file change events from the bind mount
        // never reach the container, so poll instead (set in docker-compose).
        usePolling: process.env.ASTRO_WATCH_POLLING === 'true',
        interval: 300,
      },
    },
  },
});
