// Path: vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Alias @/ → src/
  // Permet d'écrire : import Button from '@/components/ui/Button'
  // au lieu de     : import Button from '../../components/ui/Button'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Configuration du serveur de développement
  // host: true permet d'écouter sur toutes les interfaces réseau
  // Indispensable pour tester l'app sur téléphone via le WiFi
  server: {
    host: true,
  },
})
