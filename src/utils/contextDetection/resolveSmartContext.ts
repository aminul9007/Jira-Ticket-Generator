import type { Environment } from '../../types/bugReport'
import type {
  DetectedEnvironment,
  DetectedField,
  ExtractedContext,
} from '../../types/contextDetection'
import type { TextDetectionOptions } from './detectBrowserFromText'
import {
  detectBrowserFromSession,
  detectDeviceFromSession,
  detectOsFromSession,
} from './detectFromSession'
import { extractContextFromText } from './extractContextFromText'

export interface ResolveSmartContextOptions extends TextDetectionOptions {
  /** Fill browser/OS/device from navigator when not found in text. Never used for environment. */
  fillSession?: boolean
  /** Pre-selected environment chips (Settings / form defaults). */
  defaultEnvironments?: Environment[]
}

function legacyEnvironmentToDetected(
  environments: Environment[],
): DetectedField<DetectedEnvironment> | null {
  if (environments.length !== 1) return null

  switch (environments[0]) {
    case 'Production':
      return { value: 'production', source: 'default' }
    case 'Beta':
      return { value: 'beta', source: 'default' }
    case 'Canary':
      return { value: 'canary', source: 'default' }
    default:
      return null
  }
}

/**
 * Resolve QA context from issue text with optional voice fuzzy matching,
 * session auto-detection (browser/OS/device only), and environment defaults.
 */
export function resolveSmartContext(
  text: string,
  options: ResolveSmartContextOptions = {},
): ExtractedContext {
  const fromText = extractContextFromText(text, { fuzzy: options.fuzzy })

  let browser = fromText.browser
  let os = fromText.os
  let device = fromText.device
  let environment = fromText.environment

  if (options.fillSession) {
    if (browser.value === 'Unknown') {
      browser = detectBrowserFromSession()
    }
    if (os.value === 'Unknown') {
      os = detectOsFromSession()
    }
    if (device.value === 'Unknown') {
      device = detectDeviceFromSession()
    }
  }

  if (environment.value === 'unknown') {
    const fromDefault = legacyEnvironmentToDetected(options.defaultEnvironments ?? [])
    if (fromDefault) {
      environment = fromDefault
    }
  }

  return { browser, os, device, environment }
}
