/** Extension version metadata injected at build time from package.json. */

declare const __EXTENSION_VERSION__: string | undefined
declare const __EXTENSION_VERSION_NAME__: string | undefined

function readVersion(): string {
  return typeof __EXTENSION_VERSION__ === 'string' ? __EXTENSION_VERSION__ : '0.0.0'
}

function readVersionName(): string {
  return typeof __EXTENSION_VERSION_NAME__ === 'string' ? __EXTENSION_VERSION_NAME__ : 'Development'
}

export const extensionVersion = {
  version: readVersion(),
  versionName: readVersionName(),
} as const

export function formatExtensionVersionLabel(): string {
  return `${extensionVersion.version} (${extensionVersion.versionName})`
}
