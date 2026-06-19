#!/usr/bin/env node
/**
 * Validates dist-extension/ is ready for Chrome "Load unpacked".
 * Run after: npm run extension:build
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(rootDir, process.env.EXTENSION_OUT_DIR?.trim() || 'dist-extension')

const requiredFiles = [
  'manifest.json',
  'background/background.js',
  'popup/index.html',
  'icons/icon-16.png',
  'icons/icon-32.png',
  'icons/icon-48.png',
  'icons/icon-128.png',
]

const allowedPermissions = new Set(['storage', 'activeTab'])

function fail(message) {
  console.error(`[verify-extension-build] FAIL: ${message}`)
  process.exit(1)
}

function warn(message) {
  console.warn(`[verify-extension-build] WARN: ${message}`)
}

function pass(message) {
  console.log(`[verify-extension-build] OK: ${message}`)
}

if (!existsSync(outDir)) {
  fail(`Output folder not found: ${outDir}. Run npm run extension:build first.`)
}

for (const relativePath of requiredFiles) {
  const fullPath = resolve(outDir, relativePath)
  if (!existsSync(fullPath)) {
    fail(`Missing required file: ${relativePath}`)
  }
  pass(`Found ${relativePath}`)
}

if (existsSync(resolve(outDir, 'src'))) {
  fail('Stale nested build folder dist-extension/src — rebuild required.')
}

const popupHtml = readFileSync(resolve(outDir, 'popup/index.html'), 'utf8')
if (!popupHtml.includes('./assets/popup-') || !popupHtml.includes('id="root"')) {
  fail('popup/index.html is missing bundled assets or root mount point.')
}
pass('popup/index.html references bundled assets')

const popupAssetsDir = resolve(outDir, 'popup/assets')
const jsBundles = readFileSync(resolve(outDir, 'popup/index.html'), 'utf8').match(/popup-[A-Za-z0-9_-]+\.js/g)
if (!jsBundles?.length) {
  fail('No popup JS bundle referenced in index.html')
}

const manifest = JSON.parse(readFileSync(resolve(outDir, 'manifest.json'), 'utf8'))

if (manifest.manifest_version !== 3) {
  fail('manifest.json must use manifest_version 3')
}
pass('Manifest V3 confirmed')

for (const permission of manifest.permissions ?? []) {
  if (!allowedPermissions.has(permission)) {
    fail(`Unexpected permission "${permission}". Allowed: storage, activeTab`)
  }
}
pass(`Permissions: ${(manifest.permissions ?? []).join(', ')}`)

if (!manifest.commands?.['open-assistant']) {
  fail('Missing open-assistant command')
}
pass('Keyboard command open-assistant configured')

if (manifest.background?.service_worker !== 'background/background.js') {
  fail('Background service worker path is incorrect')
}
if (manifest.background?.type !== 'module') {
  fail('Background service worker must use type module')
}
pass('MV3 service worker configured')

if (manifest.action?.default_popup !== 'popup/index.html') {
  fail('Action default_popup must be popup/index.html')
}
pass('Popup action configured')

for (const iconPath of ['icons/icon-16.png', 'icons/icon-32.png', 'icons/icon-48.png', 'icons/icon-128.png']) {
  const size = statSync(resolve(outDir, iconPath)).size
  if (size > 256_000) {
    warn(`${iconPath} is ${Math.round(size / 1024)} KB — consider optimizing before store submission`)
  }
}

const bundlePath = resolve(outDir, 'popup/assets', jsBundles[0])
if (!existsSync(bundlePath)) {
  fail(`Referenced bundle missing: ${jsBundles[0]}`)
}
pass(`Popup bundle present (${Math.round(statSync(bundlePath).size / 1024)} KB)`)

console.log(`\n[verify-extension-build] Release folder ready: ${outDir}`)
console.log('[verify-extension-build] Load in Chrome: chrome://extensions → Developer mode → Load unpacked')
