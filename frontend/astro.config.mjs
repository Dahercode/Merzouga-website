import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import lit from '@astrojs/lit';
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
  site: 'https://truemoroccotours.com', // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  sitemap: true, // Generate sitemap (set to "false" to disable)
  integrations: [sitemap(), mdx(), lit(), icon(), astroI18next()], // Add renderers to the config
  output: 'static', // Output directory for the built site
  defaultLocale: "en",
  locales: ["en", "fr", "es"],
});
