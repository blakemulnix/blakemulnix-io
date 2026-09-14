/**
 * One palette, with a role per colour so additions stay disciplined rather
 * than decorative.
 */
export const palette = {
  /** Page ground. */
  pine: '#141d17',
  /** Primary text. */
  sand: '#e7dcc4',
  /** Body copy. */
  muted: '#c9bfa6',
  /** Primary accent: year readout, active node, calls to action. */
  ochre: '#d9a05b',
  /** Secondary: company names, contour lines, the spine. */
  moss: '#93b06e',
  /** Reserved for How I Work — markers and rules. */
  rust: '#b4573c',
  /** Cool counterpoint: technology chips and photo captions. */
  stone: '#7d9aa8',
  /** Legible chip text on a stone-tinted fill. */
  stoneText: '#c3d6df',
} as const
