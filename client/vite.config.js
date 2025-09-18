import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to the backend server
    },
  },  
  plugins: [react(),
      tailwindcss(),]
})
