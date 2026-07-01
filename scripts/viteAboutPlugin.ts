import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

function readAppVersion(rootDir: string): string {
  const pkgPath = join(rootDir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version?: string }
  return pkg.version ?? '0.0.0'
}

function readAboutHtml(rootDir: string): string {
  const aboutHtmlPath = join(rootDir, 'about', 'about.html')
  const raw = readFileSync(aboutHtmlPath, 'utf8')
  return raw.replace(/\{\{APP_VERSION\}\}/g, readAppVersion(rootDir))
}

function copyAboutDirectory(rootDir: string, destDir: string): void {
  const aboutSource = resolve(rootDir, 'about')
  if (!existsSync(aboutSource)) return

  cpSync(aboutSource, destDir, { recursive: true })
  const aboutHtmlDest = join(destDir, 'about.html')
  writeFileSync(aboutHtmlDest, readAboutHtml(rootDir), 'utf8')
}

function ensureAboutAssets(rootDir: string): void {
  const aboutDir = resolve(rootDir, 'about')
  const assetsDir = join(aboutDir, 'assets')
  const iconSrc = resolve(rootDir, 'src/extension/icons/icon-48.png')
  const iconDest = join(assetsDir, 'icon-48.png')

  mkdirSync(assetsDir, { recursive: true })
  if (existsSync(iconSrc)) {
    copyFileSync(iconSrc, iconDest)
  }
}

/** Serve and copy the static about/ page for web and extension builds. */
export function aboutStaticPlugin(rootDir: string): Plugin {
  const aboutDir = resolve(rootDir, 'about')

  return {
    name: 'about-static',
    buildStart() {
      ensureAboutAssets(rootDir)
    },
    configureServer(server) {
      server.middlewares.use('/about', (req, res, next) => {
        const rawPath = req.url?.split('?')[0] ?? '/about.html'
        const relative = rawPath === '/' ? 'about.html' : rawPath.replace(/^\//, '')
        const filePath = join(aboutDir, relative)

        if (!filePath.startsWith(aboutDir) || !existsSync(filePath)) {
          next()
          return
        }

        const ext = relative.slice(relative.lastIndexOf('.'))
        res.statusCode = 200
        res.setHeader('Content-Type', MIME[ext] ?? 'application/octet-stream')
        if (relative === 'about.html') {
          res.end(readAboutHtml(rootDir))
          return
        }
        res.end(readFileSync(filePath))
      })
    },
    closeBundle() {
      ensureAboutAssets(rootDir)
      if (existsSync(aboutDir)) {
        copyAboutDirectory(rootDir, join(rootDir, 'dist', 'about'))
      }
    },
  }
}

export function copyAboutToExtension(outDir: string, rootDir: string): void {
  ensureAboutAssets(rootDir)
  copyAboutDirectory(rootDir, resolve(outDir, 'about'))
}
