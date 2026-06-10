import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const useHttps = process.env.VITE_DEV_HTTPS === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [...(useHttps ? [basicSsl()] : []), react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
})
