import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Base absolue pour GitHub Pages. L'app est publiée dans le sous-dossier /app
  // de la branche (https://<user>.github.io/cdm-2026/app/) afin de coexister
  // avec le site existant servi à la racine.
  base: '/cdm-2026/app/',
  plugins: [react()],
  server: { port: 5173, host: true },
})
