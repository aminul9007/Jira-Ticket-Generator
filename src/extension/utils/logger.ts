import { extensionConfig } from '../config/extensionConfig'

type LogLevel = 'info' | 'warn' | 'error'

function shouldLog(level: LogLevel): boolean {
  if (level === 'error' || level === 'warn') return true
  return extensionConfig.isDev || extensionConfig.features.verboseLogging
}

function write(level: LogLevel, message: string, context?: unknown): void {
  if (!shouldLog(level)) return

  const prefix = '[QA Bug Assistant]'
  if (context !== undefined) {
    // Prefix must stay the first console argument for readable DevTools output.
    console[level](prefix, message, context)
    return
  }

  console[level](prefix, message)
}

export const logger = {
  info(message: string, context?: unknown): void {
    write('info', message, context)
  },
  warn(message: string, context?: unknown): void {
    write('warn', message, context)
  },
  error(message: string, context?: unknown): void {
    write('error', message, context)
  },
}
