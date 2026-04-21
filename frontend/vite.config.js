import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/meme-api': {
        target: 'https://four.meme',
        changeOrigin: true,
        headers: {
          'Origin': 'https://four.meme',
          'Referer': 'https://four.meme/'
        }
      },
    },
  },
})

