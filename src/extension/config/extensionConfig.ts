/** Centralized extension runtime configuration — avoid hardcoded URLs in components. */

export interface ExtensionFeatureFlags {
  analytics: boolean
  verboseLogging: boolean
}

export interface ExtensionConfig {
  apiBaseUrl: string
  isDev: boolean
  features: ExtensionFeatureFlags
}

declare const __EXTENSION_API_BASE_URL__: string | undefined
declare const __EXTENSION_IS_DEV__: boolean | undefined

function readApiBaseUrl(): string {
  if (typeof __EXTENSION_API_BASE_URL__ === 'string' && __EXTENSION_API_BASE_URL__) {
    return __EXTENSION_API_BASE_URL__
  }

  const fromVite = import.meta.env.VITE_API_BASE_URL
  if (typeof fromVite === 'string' && fromVite.trim()) {
    return fromVite.replace(/\/$/, '')
  }

  return 'http://localhost:3001'
}

function readIsDev(): boolean {
  if (typeof __EXTENSION_IS_DEV__ === 'boolean') {
    return __EXTENSION_IS_DEV__
  }

  return import.meta.env.DEV
}

export const extensionConfig: ExtensionConfig = {
  apiBaseUrl: readApiBaseUrl(),
  isDev: readIsDev(),
  features: {
    analytics: false,
    verboseLogging: readIsDev(),
  },
}

export function getApiBaseUrl(): string {
  return extensionConfig.apiBaseUrl.replace(/\/$/, '')
}
