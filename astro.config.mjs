import { defineConfig } from 'astro/config';

// Deployed at https://nopsfr.github.io/brandon-s-comic/
// If this repository is ever renamed, update `base` (and `site`) to match.
export default defineConfig({
  site: 'https://nopsfr.github.io',
  base: '/brandon-s-comic',
  trailingSlash: 'always',
  output: 'static',
});
