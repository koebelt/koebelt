import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    // The only chunk over the default limit is SphereEngine (three.js), which is
    // dynamically imported on purpose and never blocks first paint.
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    // Array form (regex) because the bare `@ds` barrel and `@ds/<file>` need
    // different resolutions; object-form alias prefix-matching would mangle `@ds`.
    alias: [
      { find: /^@ds$/, replacement: r('./design_system/index.js') },
      { find: /^@ds\//, replacement: r('./design_system/') },
    ],
  },
})
