import { defineConfig } from 'astro/config';

// Deployed at https://nopsfr.github.io/Brandon-s-comic/
// GitHub Pages asset paths are case-sensitive, so `base` must match the
// repository name's exact casing. If this repository is ever renamed,
// update `base` (and `site`) to match.
export default defineConfig({
  site: 'https://nopsfr.github.io',
  base: '/Brandon-s-comic',
  trailingSlash: 'always',
  output: 'static',
});
