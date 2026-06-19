import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

function extensionBuildPlugin() {
  return {
    name: 'extension-build',
    closeBundle() {
      const outDir = resolve(rootDir, 'dist/extension')
      const popupDir = resolve(outDir, 'popup')
      const nestedHtml = resolve(outDir, 'src/extension/popup/index.html')
      const popupHtml = resolve(popupDir, 'index.html')

      mkdirSync(popupDir, { recursive: true })

      if (existsSync(nestedHtml)) {
        let html = readFileSync(nestedHtml, 'utf8')
        html = html.replace(/(src|href)="(?:\/|\.\.\/)*popup\/assets\//g, '$1="./assets/')
        writeFileSync(popupHtml, html)
        rmSync(resolve(outDir, 'src'), { recursive: true, force: true })
      }

      copyFileSync(
        resolve(rootDir, 'src/extension/manifest/manifest.json'),
        resolve(outDir, 'manifest.json'),
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')

  return {
    base: './',
    publicDir: false,
    envDir: rootDir,
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3001',
      ),
    },
    plugins: [react(), extensionBuildPlugin()],
    build: {
      outDir: 'dist/extension',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(rootDir, 'src/extension/popup/index.html'),
          background: resolve(rootDir, 'src/extension/background/background.ts'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === 'background') {
              return 'background/background.js'
            }
            return 'popup/assets/[name]-[hash].js'
          },
          chunkFileNames: 'popup/assets/[name]-[hash].js',
          assetFileNames: 'popup/assets/[name]-[hash][extname]',
        },
      },
    },
  }
})
