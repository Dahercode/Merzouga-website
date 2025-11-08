import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import lit from '@astrojs/lit';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://truemoroccotours.com', // Your public domain, e.g.: https://my-site.dev/. Used to generate sitemaps and canonical URLs.
  sitemap: true, // Generate sitemap (set to "false" to disable)
  integrations: [sitemap(), mdx(), lit(), icon(), vue()], // Add renderers to the config
  output: 'static', // Output directory for the built site
});
