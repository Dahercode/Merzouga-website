/** @type {import('astro-i18next').AstroI18nextConfig} */
module.exports = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  namespaces: ['common', 'home', 'tours', 'footer', 'gallery', 'contact'],
  defaultNamespace: 'common',
  load: ['server', 'client'],
};
