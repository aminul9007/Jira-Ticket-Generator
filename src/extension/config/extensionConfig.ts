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

const RESOLVED_API_URL_KEY = 'qa-bug-assistant-resolved-api-url'
const FALLBACK_API_URLS = ['http://localhost:3001', 'http://127.0.0.1:3001']

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

let cachedResolvedApiUrl: string | null = null

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '')
}

function readStoredApiUrl(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve(null)
      return
    }

    chrome.storage.local.get(RESOLVED_API_URL_KEY, (result) => {
      const value = result[RESOLVED_API_URL_KEY]
      resolve(typeof value === 'string' && value.trim() ? normalizeBaseUrl(value) : null)
    })
  })
}

function writeStoredApiUrl(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      resolve()
      return
    }

    chrome.storage.local.set({ [RESOLVED_API_URL_KEY]: url }, () => resolve())
  })
}

export async function pingExtensionApi(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = globalThis.setTimeout(() => controller.abort(), 4000)
    const response = await fetch(`${normalizeBaseUrl(baseUrl)}/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    globalThis.clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

/** Find a reachable API base URL (localhost, then 127.0.0.1). */
export async function resolveExtensionApiBaseUrl(): Promise<string | null> {
  if (cachedResolvedApiUrl && (await pingExtensionApi(cachedResolvedApiUrl))) {
    return cachedResolvedApiUrl
  }

  const stored = await readStoredApiUrl()
  if (stored && (await pingExtensionApi(stored))) {
    cachedResolvedApiUrl = stored
    return stored
  }

  const configured = normalizeBaseUrl(getApiBaseUrl())
  const candidates = [
    configured,
    ...FALLBACK_API_URLS.filter((url) => url !== configured),
  ]

  for (const candidate of candidates) {
    if (await pingExtensionApi(candidate)) {
      cachedResolvedApiUrl = candidate
      await writeStoredApiUrl(candidate)
      return candidate
    }
  }

  cachedResolvedApiUrl = null
  return null
}

export function getApiBaseUrl(): string {
  return normalizeBaseUrl(cachedResolvedApiUrl ?? extensionConfig.apiBaseUrl)
}

export function resetResolvedApiBaseUrlCache(): void {
  cachedResolvedApiUrl = null
}
