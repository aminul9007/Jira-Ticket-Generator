import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedEnvironment,
  DetectedField,
  DetectedOs,
  ExtractedContext,
} from '../../types/contextDetection'
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

/** Extract context from voice transcript only — no session/browser defaults. */
export function extractContextFromVoice(transcript: string): ExtractedContext {
  return {
    environment: detectEnvironmentFromText(transcript) ?? UNKNOWN_ENVIRONMENT,
    browser: detectBrowserFromText(transcript) ?? UNKNOWN_BROWSER,
    os: detectOsFromText(transcript) ?? UNKNOWN_OS,
    device: detectDeviceFromText(transcript) ?? UNKNOWN_DEVICE,
  }
}
