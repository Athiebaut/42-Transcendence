import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    // Permet d'écouter sur 0.0.0.0 pour être accessible hors du conteneur
    host: true,
    port: 5173,

    // Option souvent nécessaire sur Linux/Docker pour que le Hot Reload détecte bien les changements de fichiers
    watch: {
      usePolling: true,
    },

    // Configuration du Proxy pour rediriger les appels API vers le Backend
   proxy: {
      // Gardez celui-ci pour Google et le 2FA (qui sont bien dans /auth d'après vos logs)
      '/auth': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      },
      // AJOUTEZ CES ROUTES RACINES (d'après vos logs backend)
      '/register': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      },
      '/login': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      },
      '/history': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      },
      // ...existing code...
      '/profile': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      },
      // Capture les requêtes génériques API (si vous en avez)
      '/api': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      },
      // Capture les accès aux fichiers statiques du backend (avatars, etc.)
      '/public': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})