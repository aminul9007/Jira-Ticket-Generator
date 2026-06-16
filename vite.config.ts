import { defineConfig, loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const useHttps = process.env.VITE_DEV_HTTPS === 'true'
const lanIp = process.env.VITE_LAN_IP?.trim()

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [...(useHttps ? [basicSsl()] : []), react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      // WebSocket HMR must use the LAN IP when other devices load the HTTPS page.
      hmr: useHttps && lanIp
        ? {
            host: lanIp,
            protocol: 'wss',
            port: 5173,
            clientPort: 5173,
          }
        : true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
    },
  }
})
