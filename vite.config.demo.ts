// Path: vite.config.demo.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Configuration autonome pour le déploiement ou build séparé du mode démo
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: {
        demo: path.resolve(__dirname, 'demo/index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
})
