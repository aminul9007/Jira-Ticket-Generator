import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { extensionConfig } from '../config/extensionConfig'
import { logger } from './logger'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    extensionConfig.isDev = false
    extensionConfig.features.verboseLogging = true
  })

  it('always logs warnings and errors in production', () => {
    extensionConfig.isDev = false
    extensionConfig.features.verboseLogging = false

    logger.warn('shortcut failed')
    logger.error('popup crashed')

    expect(console.warn).toHaveBeenCalledWith('[QA Bug Assistant]', 'shortcut failed')
    expect(console.error).toHaveBeenCalledWith('[QA Bug Assistant]', 'popup crashed')
    expect(console.info).not.toHaveBeenCalled()
  })

  it('logs info when verbose logging is enabled', () => {
    extensionConfig.isDev = false
    extensionConfig.features.verboseLogging = true

    logger.info('extension installed')

    expect(console.info).toHaveBeenCalledWith('[QA Bug Assistant]', 'extension installed')
  })

  it('suppresses info when verbose logging is disabled', () => {
    extensionConfig.isDev = false
    extensionConfig.features.verboseLogging = false

    logger.info('extension installed')

    expect(console.info).not.toHaveBeenCalled()
  })

  it('keeps prefix first when logging with context', () => {
    extensionConfig.isDev = false
    extensionConfig.features.verboseLogging = true

    const context = { reason: 'network' }
    logger.error('Ticket generation failed', context)

    expect(console.error).toHaveBeenCalledWith(
      '[QA Bug Assistant]',
      'Ticket generation failed',
      context,
    )
  })
})
