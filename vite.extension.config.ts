import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

function readExtensionVersionMetadata(): { version: string; versionName: string } {
  const pkg = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8')) as {
    version?: string
    versionName?: string
  }
  const extensionMeta = JSON.parse(
    readFileSync(resolve(rootDir, 'src/extension/config/packageMetadata.json'), 'utf8'),
  ) as { version?: string; versionName?: string }

  return {
    version: extensionMeta.version ?? pkg.version ?? '0.0.0',
    versionName: extensionMeta.versionName ?? pkg.versionName ?? '',
  }
}

function extensionBuildPlugin(outDirName: string) {
  return {
    name: 'extension-build',
    closeBundle() {
      const outDir = resolve(rootDir, outDirName)
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

      const { version, versionName } = readExtensionVersionMetadata()
      const manifestSource = resolve(rootDir, 'src/extension/manifest/manifest.json')
      const manifest = JSON.parse(readFileSync(manifestSource, 'utf8')) as Record<string, unknown>
      manifest.version = version
      manifest.version_name = versionName
      writeFileSync(resolve(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

      const iconsDir = resolve(outDir, 'icons')
      const sourceIconsDir = resolve(rootDir, 'src/extension/icons')
      mkdirSync(iconsDir, { recursive: true })
      for (const size of ['16', '32', '48', '128']) {
        copyFileSync(
          resolve(sourceIconsDir, `icon-${size}.png`),
          resolve(iconsDir, `icon-${size}.png`),
        )
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const { version, versionName } = readExtensionVersionMetadata()
  const outDirName = process.env.EXTENSION_OUT_DIR?.trim() || 'dist-extension'
  const apiBaseUrl = env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3001'

  return {
    base: './',
    publicDir: false,
    envDir: rootDir,
    define: {
      __EXTENSION_API_BASE_URL__: JSON.stringify(apiBaseUrl),
      __EXTENSION_IS_DEV__: JSON.stringify(mode !== 'production'),
      __EXTENSION_VERBOSE_LOGGING__: JSON.stringify(true),
      __EXTENSION_VERSION__: JSON.stringify(version),
      __EXTENSION_VERSION_NAME__: JSON.stringify(versionName),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
    },
    plugins: [react(), extensionBuildPlugin(outDirName)],
    build: {
      outDir: outDirName,
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
