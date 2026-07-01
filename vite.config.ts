import { defineConfig, loadEnv } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { aboutStaticPlugin } from './scripts/viteAboutPlugin'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

const useHttps = process.env.VITE_DEV_HTTPS === 'true'
const lanIp = process.env.VITE_LAN_IP?.trim()
const devPort = Number(process.env.VITE_DEV_PORT ?? 5173)

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [...(useHttps ? [basicSsl()] : []), react(), tailwindcss(), aboutStaticPlugin(rootDir)],
    server: {
      host: '0.0.0.0',
      port: devPort,
      strictPort: true,
      // WebSocket HMR must use the LAN IP when other devices load the HTTPS page.
      hmr: useHttps && lanIp
        ? {
            host: lanIp,
            protocol: 'wss',
            port: devPort,
            clientPort: devPort,
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
