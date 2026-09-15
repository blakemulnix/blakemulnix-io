import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    /*
     * Never inline fonts. Vite turns assets under ~4kB into data: URIs, but
     * the CloudFront response headers set `font-src 'self'`, so an inlined
     * font is blocked in production. It fails silently, as a fallback glyph
     * rather than an error, so keep them as files the CSP allows.
     * `undefined` leaves every other asset type on the default limit.
     */
    assetsInlineLimit: (filePath) => (/\.(?:woff2?|ttf|otf|eot)$/i.test(filePath) ? false : undefined),
  },
})
