import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Chemins relatifs : permet de servir l'app depuis n'importe quel sous-dossier
  // (ex. GitHub Pages : https://<user>.github.io/cdm-2026/).
  base: './',
  plugins: [react()],
  server: { port: 5173, host: true },
})
