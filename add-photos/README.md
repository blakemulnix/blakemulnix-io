# Adding photos

```bash
cp ~/wherever/*.JPG photos/originals/
npm run add-photos
```

That scans the originals, builds the web derivatives, and opens a page for
typing in each photo's location. Labels save as you type. Press
**Save and rebuild** at the end, then commit.

Everything is written to `photos/manifest.json`, which stays the source of
truth. `src/data/photos.generated.ts` and `public/photos/` are generated from
it; do not edit those by hand.

Labels you have already typed are never overwritten, because entries are
matched on the original filename. Renaming an original loses its label.
