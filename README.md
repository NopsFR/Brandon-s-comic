# I.D.K — *I dunno*

The website for **I.D.K**, a webcomic by Brandon.

This is a static site: there's no backend, no database, and no CMS. Comic
pages are plain image files in a folder, and the site figures out the
reading order automatically.

## Tech stack

- [Astro](https://astro.build/) (static output, no client-side framework)
- TypeScript
- Plain CSS (no Tailwind, no component library)
- A small amount of vanilla JavaScript for the reader's keyboard/scroll
  navigation

Hosted for free on **GitHub Pages**, deployed automatically by the
GitHub Actions workflow in `.github/workflows/deploy.yml`.

## Adding a comic page

This is the main thing you'll do day-to-day, and it doesn't require
touching any code.

1. Export the page as **WebP** (or PNG/JPG/AVIF — all work, but WebP is
   the smallest for the same quality).
2. Name the file with **three digits**, in order:
   ```
   001.webp
   002.webp
   003.webp
   ```
   If you ever pass 999 pages, just use more digits (`1000.webp`) — the
   site sorts numerically, not alphabetically.
3. Put the file in:
   ```
   public/comics/
   ```
4. Commit and push the file.
5. The GitHub Actions workflow rebuilds and redeploys the site
   automatically. No other file needs to change.

### How the numbering works

At build time, the site reads whatever is inside `public/comics/`, pulls
the leading number out of each filename, and sorts pages by that number.
There's no manifest file to keep in sync and no hardcoded page count.

If you upload `001.webp`, `002.webp`, and `004.webp` (skipping `003`),
the reader will still show four pages — page 003 will display a
"Comic page not uploaded yet" placeholder instead of a broken image.
This is meant to make gaps obvious during development; once every page
up to the current highest number is uploaded, the placeholders disappear
on their own.

### Supported file types

`.webp`, `.avif`, `.png`, `.jpg`, `.jpeg` — anything else in
`public/comics/` is ignored. Running `npm run build` (or
`npm run check-comics`) prints a warning if a file doesn't match the
`NNN.ext` naming pattern, so typos get caught early.

## Updating text content

Almost all of the site's editable copy — the title, subtitle, homepage
description, about text, content warnings, and social links — lives in
one file:

```
src/config/comic.ts
```

Edit the values there; you don't need to touch any `.astro` component to
change wording.

## Local development

Requires [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

This starts a local dev server (usually at `http://localhost:4321/`) with
hot reload. Drop test images into `public/comics/` to see the reader
populate.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` validates the filenames in `public/comics/`, type-checks
the project, and produces a static site in `dist/`. `npm run preview`
serves that build locally so you can check it before deploying.

## Deployment (GitHub Pages)

1. In the repository's **Settings → Pages**, set the source to
   **GitHub Actions**.
2. Push to `main`. The workflow at `.github/workflows/deploy.yml` builds
   the site and publishes `dist/` to GitHub Pages automatically.
3. The site will be available at:
   ```
   https://nopsfr.github.io/brandon-s-comic/
   ```

If this repository is ever renamed, update the `base` (and `site`) values
in `astro.config.mjs` to match the new URL — otherwise internal links and
asset paths will point to the wrong place.

## Project structure

```
public/
  comics/           ← comic page images live here (see above)
  favicon.svg
src/
  components/       ← small, reusable UI pieces
  config/
    comic.ts        ← the single file for editable site text
  layouts/
    BaseLayout.astro
  pages/
    index.astro     ← homepage  →  /
    read/
      index.astro   ← continuous reader  →  /read/
      [page].astro  ← per-page URL, same reader, scrolled into position  →  /read/1, /read/2, ...
    archive/
      index.astro   → /archive/
    about/
      index.astro   → /about/
  styles/
    global.css      ← design tokens (colors, type, spacing) and base styles
  utils/
    comics.ts        ← reads public/comics/ at build time and builds the page list
scripts/
  validate-comics.mjs ← sanity-checks filenames before every build
```

## Design notes

- **Reading experience first.** The continuous vertical reader is the
  primary way to read the comic; `/read/1`, `/read/2`, etc. are just
  anchors into the same continuous page for sharing a specific spot.
- **No cropping, no forced aspect ratios.** Comic pages render at their
  natural size — the reader never distorts or crops artwork.
- **Missing pages are visible, not broken.** Until real artwork is
  uploaded, unpublished page numbers show a clearly labeled placeholder
  instead of a broken image icon.
- **Content is data, not markup.** Title, warnings, and body copy live in
  `src/config/comic.ts` so they can change without touching layout code.

## What's intentionally not built yet

Chapters/issues, a news/updates feed, comments, RSS, and support links
(Patreon/Ko-fi/etc.) are common things webcomic sites eventually want.
None of them are needed for v1, but the project structure — a single
config file, a plain `public/comics/` folder, and small independent
components — is meant to make adding them later straightforward rather
than requiring a rebuild.
