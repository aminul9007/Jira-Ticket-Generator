import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedEnvironment,
  DetectedField,
  DetectedOs,
  ExtractedContext,
} from '../../types/contextDetection'
import type { TextDetectionOptions } from './detectBrowserFromText'
import { detectBrowserFromText } from './detectBrowserFromText'
import { detectDeviceFromText } from './detectDeviceFromText'
import { detectEnvironmentFromText } from './detectEnvironmentFromText'
import { detectOsFromText } from './detectOsFromText'

const UNKNOWN_ENVIRONMENT: DetectedField<DetectedEnvironment> = {
  value: 'unknown',
  source: 'unknown',
}

const UNKNOWN_BROWSER: DetectedField<DetectedBrowser> = {
  value: 'Unknown',
  source: 'unknown',
}

const UNKNOWN_OS: DetectedField<DetectedOs> = {
  value: 'Unknown',
  source: 'unknown',
}

const UNKNOWN_DEVICE: DetectedField<DetectedDevice> = {
  value: 'Unknown',
  source: 'unknown',
}

/** Strict text-only extraction — no session/browser defaults. */
export function extractContextFromText(
  transcript: string,
  options: TextDetectionOptions = {},
): ExtractedContext {
  return {
    environment: detectEnvironmentFromText(transcript) ?? UNKNOWN_ENVIRONMENT,
    browser: detectBrowserFromText(transcript, options) ?? UNKNOWN_BROWSER,
    os: detectOsFromText(transcript, options) ?? UNKNOWN_OS,
    device: detectDeviceFromText(transcript, options) ?? UNKNOWN_DEVICE,
  }
}

/** @deprecated Use extractContextFromText */
export const extractContextFromVoice = extractContextFromText

export function createUnknownContext(): ExtractedContext {
  return {
    environment: { ...UNKNOWN_ENVIRONMENT },
    browser: { ...UNKNOWN_BROWSER },
    os: { ...UNKNOWN_OS },
    device: { ...UNKNOWN_DEVICE },
  }
}
