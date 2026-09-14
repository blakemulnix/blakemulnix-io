export interface Photo {
  /** Path under public/. Omit to render a placeholder tile. */
  src?: string
  alt: string
  caption: string
  /** Portrait tiles span two rows in the gallery. */
  portrait?: boolean
}

// Placeholder copy and tiles. Swap `src` in as real photos are optimized;
// the gallery renders a tinted tile wherever `src` is absent.
export const outsideIntro = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravel roads, long weekends, and a tent that has seen better days. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.',
]

export const photos: Photo[] = [
  { alt: 'Placeholder', caption: 'Lorem ipsum, Iowa', portrait: true },
  { alt: 'Placeholder', caption: 'Dolor sit amet' },
  { alt: 'Placeholder', caption: 'Consectetur adipiscing' },
  { alt: 'Placeholder', caption: 'Sed do eiusmod, Utah' },
  { alt: 'Placeholder', caption: 'Tempor incididunt', portrait: true },
  { alt: 'Placeholder', caption: 'Magna aliqua' },
]
