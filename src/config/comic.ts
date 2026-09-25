/**
 * Central configuration for the comic.
 *
 * Brandon: this is the one file you should need to edit to update the
 * site's text. It does not control the comic pages themselves — see
 * README.md for how to add new pages to `public/comics/`.
 */

export interface SocialLink {
  label: string;
  url: string;
}

export const comic = {
  title: 'I.D.K',
  subtitle: 'I dunno',
  author: 'Brandon',

  /**
   * Short line shown in the browser tab and link previews.
   */
  tagline: 'A webcomic by Brandon.',

  /**
   * Homepage intro copy. Replace with the real description whenever it's
   * ready — this is intentionally a placeholder.
   */
  description:
    "[Brandon can replace this text with the official description of I.D.K. " +
    "A short paragraph about what the comic is, or what it's like to read, works well here.]",

  /**
   * About page copy. Replace with Brandon's own words.
   */
  aboutText:
    '[Brandon can replace this text with his own bio, process notes, or ' +
    'anything else he wants readers to know about I.D.K. and himself.]',

  /**
   * Content warning, shown on the homepage and before the reader.
   * Keep this accurate and up to date with the comic's actual content.
   */
  contentWarnings: [
    'Graphic violence / gore — occasional',
    'Frontal nudity — occasional',
  ],

  /**
   * Optional social / support links. Empty by default — add entries like
   * { label: 'Twitter', url: 'https://...' } once they exist.
   */
  social: [] as SocialLink[],
};

export type Comic = typeof comic;
