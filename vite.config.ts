import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.192.91:5000',
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    watch: {
      // use polling to make reloading work in docker
      usePolling: true,
    },
  },
})
