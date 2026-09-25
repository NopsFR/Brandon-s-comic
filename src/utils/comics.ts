import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads comic pages straight out of `public/comics/` at build time.
 *
 * Brandon never has to edit this file or any component to add a page —
 * dropping `004.webp` into `public/comics/` and rebuilding is enough.
 * See README.md for the full explanation.
 */

export interface ComicFile {
  /** Page number parsed from the filename, e.g. 7 for "007.webp". */
  number: number;
  /** Original filename on disk. */
  filename: string;
  /** Public URL to the file, including the site's base path. */
  src: string;
}

export interface ComicPage {
  number: number;
  /** null when this page number has no uploaded file yet. */
  file: ComicFile | null;
}

const VALID_EXTENSIONS = new Set(['.webp', '.avif', '.png', '.jpg', '.jpeg']);
const COMICS_DIR = path.resolve(process.cwd(), 'public/comics');

function readComicFiles(): ComicFile[] {
  let entries: string[] = [];

  try {
    entries = fs.readdirSync(COMICS_DIR);
  } catch {
    return [];
  }

  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return entries
    .filter((name) => VALID_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .map((filename) => {
      const match = filename.match(/^0*(\d+)/);
      const number = match ? parseInt(match[1], 10) : NaN;
      return { number, filename, src: `${base}comics/${filename}` };
    })
    .filter((file) => Number.isFinite(file.number))
    .sort((a, b) => a.number - b.number);
}

/** All comic files that currently exist on disk, in page order. */
export function getComicFiles(): ComicFile[] {
  return readComicFiles();
}

/** The highest page number found on disk (0 if no pages uploaded yet). */
export function getMaxPageNumber(): number {
  const files = readComicFiles();
  return files.length ? Math.max(...files.map((f) => f.number)) : 0;
}

/**
 * A complete, gap-filled run of pages from 1 to the highest uploaded page
 * number. Missing numbers come back with `file: null` so the reader can
 * render an explicit "not uploaded yet" placeholder instead of a broken
 * image or a silent gap.
 *
 * If nothing has been uploaded yet, returns a single placeholder page so
 * the reader UI still has something to render during development.
 */
export function getComicPages(): ComicPage[] {
  const files = readComicFiles();
  const byNumber = new Map(files.map((f) => [f.number, f]));
  const max = Math.max(1, getMaxPageNumber());

  const pages: ComicPage[] = [];
  for (let n = 1; n <= max; n++) {
    pages.push({ number: n, file: byNumber.get(n) ?? null });
  }
  return pages;
}

export function formatPageNumber(n: number): string {
  return String(n).padStart(3, '0');
}
