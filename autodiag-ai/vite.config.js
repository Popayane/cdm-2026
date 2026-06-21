import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Base absolue pour GitHub Pages (https://<user>.github.io/cdm-2026/).
  // Indispensable pour que les assets se chargent même sans slash final dans l'URL.
  base: '/cdm-2026/',
  plugins: [react()],
  server: { port: 5173, host: true },
})
