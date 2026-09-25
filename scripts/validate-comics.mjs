#!/usr/bin/env node
// Sanity-checks public/comics/ before every build so a bad filename fails
// fast with a clear message instead of silently vanishing from the reader.
import fs from 'node:fs';
import path from 'node:path';

const COMICS_DIR = path.resolve('public/comics');
const VALID_EXTENSIONS = new Set(['.webp', '.avif', '.png', '.jpg', '.jpeg']);
const VALID_NAME = /^\d{3,}\.(webp|avif|png|jpe?g)$/i;

function main() {
  if (!fs.existsSync(COMICS_DIR)) {
    console.log('[comics] public/comics/ not found — nothing to validate.');
    return;
  }

  const entries = fs
    .readdirSync(COMICS_DIR)
    .filter((name) => !name.startsWith('.'));

  const imageFiles = entries.filter((name) => VALID_EXTENSIONS.has(path.extname(name).toLowerCase()));
  const malformed = imageFiles.filter((name) => !VALID_NAME.test(name));
  const numbers = imageFiles
    .filter((name) => VALID_NAME.test(name))
    .map((name) => parseInt(name.match(/^0*(\d+)/)[1], 10));

  const duplicates = numbers.filter((n, i) => numbers.indexOf(n) !== i);

  if (malformed.length > 0) {
    console.warn(
      `[comics] Warning: ${malformed.length} file(s) don't match the "NNN.ext" naming pattern and will be ignored by the reader:\n` +
        malformed.map((name) => `  - ${name}`).join('\n')
    );
  }

  if (duplicates.length > 0) {
    console.warn(
      `[comics] Warning: duplicate page number(s) found — only one file per number will be used: ${[...new Set(duplicates)].join(', ')}`
    );
  }

  console.log(`[comics] Found ${numbers.length} valid comic page(s) in public/comics/.`);
}

main();
