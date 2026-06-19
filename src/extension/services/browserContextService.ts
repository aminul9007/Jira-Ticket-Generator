import type { BrowserContext } from '../types/browserContext'

export async function captureBrowserContext(): Promise<BrowserContext> {
  const timestamp = new Date().toISOString()

  try {
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        resolve(result)
      })
    })

    const activeTab = tabs[0]

    return {
      url: activeTab?.url ?? '',
      title: activeTab?.title ?? '',
      timestamp,
    }
  } catch {
    return {
      url: '',
      title: '',
      timestamp,
    }
  }
}
