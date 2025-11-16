/** @type {import('astro-i18next').AstroI18nextConfig} */
module.exports = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'es'],
  namespaces: ['common', 'home'],
  defaultNamespace: 'common',
  load: ['server', 'client'],
};
