import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    proxy: {
      // C'est la SEULE règle dont vous avez besoin pour le moment.
      '/back_to_back': {
        target: 'http://localhost:3042',
        changeOrigin: true,
        // Elle transforme "/back_to_back/register" en "/register" pour le backend
        rewrite: (path) => path.replace(/^\/back_to_back/, ''),
      },
    }
  }
})