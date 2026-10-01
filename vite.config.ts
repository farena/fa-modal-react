import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // dist/ is reserved for the library build (vite.lib.config.ts).
  build: { outDir: 'dist-playground' },
})
