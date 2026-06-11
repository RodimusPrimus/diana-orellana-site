import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://rodimusprimus.github.io',
  base: '/diana-orellana-site',
  output: 'static',
  build: {
    format: 'directory',
  },
});
