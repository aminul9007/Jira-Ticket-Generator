import { useEffect, useState } from 'react'
import { captureBrowserContext } from '../services/browserContextService'
import type { BrowserContext } from '../types/browserContext'

const EMPTY_CONTEXT: BrowserContext = {
  url: '',
  title: '',
  timestamp: '',
}

export function useBrowserContext(): BrowserContext {
  const [context, setContext] = useState<BrowserContext>(EMPTY_CONTEXT)

  useEffect(() => {
    let cancelled = false

    void captureBrowserContext().then((nextContext) => {
      if (!cancelled) {
        setContext(nextContext)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return context
}
