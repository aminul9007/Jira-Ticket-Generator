/**
 * about.js
 * Loads version from manifest (extension) or meta tag (web) and handles back navigation.
 */

const versionEl = document.getElementById('appVersion')
const backBtn = document.getElementById('backBtn')

function displayVersion(version) {
  if (!versionEl || !version) return
  versionEl.textContent = `v${version}`
}

if (typeof chrome !== 'undefined' && chrome.runtime?.getManifest) {
  const manifest = chrome.runtime.getManifest()
  displayVersion(manifest.version)
} else {
  const metaVersion = document.querySelector('meta[name="app-version"]')?.getAttribute('content')
  displayVersion(metaVersion?.trim() || '1.2.1')
}

backBtn.addEventListener('click', () => {
  if (window.history.length > 1) {
    window.history.back()
    return
  }

  window.close()
})
