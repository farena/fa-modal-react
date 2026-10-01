import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Builds the publishable package (JS + CSS) into dist/. Types come from tsconfig.lib.json.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // public/ only belongs to the playground.
    copyPublicDir: false,
    lib: {
      entry: 'src/index.lib.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: ['react', 'react-dom', /^react\//, /^react-dom\//],
    },
  },
})
