import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
   host: '0.0.0.0',
   port: 443,
   https: false
   },
  plugins: [react()],
  resolve: {
    alias: {
      '@styles': '/src/styles',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@context': '/src/context'
    },
  },
});
