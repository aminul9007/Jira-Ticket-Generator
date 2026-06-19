import { logger } from './logger'

export interface ApiResilienceOptions {
  maxAttempts?: number
  timeoutMs?: number
  retryDelayMs?: number
  label?: string
}

const DEFAULT_TIMEOUT_MS = 30_000
const DEFAULT_MAX_ATTEMPTS = 2
const DEFAULT_RETRY_DELAY_MS = 400

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('aborted')
    )
  }
  return false
}

/** Retry transient failures with timeout — extension API calls only. */
export async function withApiResilience<T>(
  operation: () => Promise<T>,
  options?: ApiResilienceOptions,
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const retryDelayMs = options?.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS
  const label = options?.label ?? 'request'

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error(`${label} timed out`))
          })
        }),
      ])
      window.clearTimeout(timeoutId)
      return result
    } catch (error) {
      window.clearTimeout(timeoutId)
      lastError = error
      logger.warn(`${label} attempt ${attempt}/${maxAttempts} failed`, error)

      if (attempt < maxAttempts && isRetryableError(error)) {
        await delay(retryDelayMs * attempt)
        continue
      }
      break
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`${label} failed after ${maxAttempts} attempts`)
}
