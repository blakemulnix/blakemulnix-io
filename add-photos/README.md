# Adding photos

```bash
cp ~/wherever/*.JPG photos/originals/
npm run add-photos
```

That scans the originals, builds the web derivatives, and opens a page for
filing and labelling. Everything saves as you type. Press **Save and rebuild**
at the end, then commit.

## Collections

The wall shows collections, not a flat grid, so every photo needs to be in
one. The page groups them by collection, with anything unfiled in its own
section at the bottom.

- **New collection** names one. The id comes from the name once and never
  changes, so renaming later is free.
- Drag a photo between sections to move it, or use the dropdown on its card.
- Drag within a section, or use the arrows, to set the order. The first photo
  is the collection's cover, which is what the tile on the site shows.
- The arrows in a section header order the collections themselves.
- Deleting a collection keeps its photos and makes them unfiled.

## What is generated from what

Everything is written to `photos/manifest.json`, which stays the source of
truth. `src/data/photos.generated.ts`, `src/data/collections.generated.ts` and
`public/photos/` are generated from it; do not edit those by hand.

Labels and collections you have already set are never overwritten, because
entries are matched on the original filename. Renaming an original loses them.
