import type {
  DetectedBrowser,
  DetectedDevice,
  DetectedEnvironment,
  DetectedField,
  DetectedOs,
  ExtractedContext,
} from '../../types/contextDetection'
import { detectBrowserFromText } from './detectBrowserFromText'
import { detectEnvironmentFromText } from './detectEnvironmentFromText'
import { detectDeviceFromText } from './detectDeviceFromText'
import { detectOsFromText } from './detectOsFromText'
import {
  detectBrowserFromSession,
  detectDeviceFromSession,
  detectOsFromSession,
} from './detectFromSession'

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

function resolveEnvironment(transcript: string): DetectedField<DetectedEnvironment> {
  return detectEnvironmentFromText(transcript) ?? UNKNOWN_ENVIRONMENT
}

function resolveBrowser(transcript: string): DetectedField<DetectedBrowser> {
  return detectBrowserFromText(transcript) ?? detectBrowserFromSession()
}

function resolveOs(transcript: string): DetectedField<DetectedOs> {
  return detectOsFromText(transcript) ?? detectOsFromSession()
}

function resolveDevice(transcript: string): DetectedField<DetectedDevice> {
  return detectDeviceFromText(transcript) ?? detectDeviceFromSession()
}

export function extractContext(transcript: string): ExtractedContext {
  return {
    environment: resolveEnvironment(transcript),
    browser: resolveBrowser(transcript),
    os: resolveOs(transcript),
    device: resolveDevice(transcript),
  }
}

export function createUnknownContext(): ExtractedContext {
  return {
    environment: { ...UNKNOWN_ENVIRONMENT },
    browser: { ...UNKNOWN_BROWSER },
    os: { ...UNKNOWN_OS },
    device: { ...UNKNOWN_DEVICE },
  }
}

/** Preserve chip edits (source: user) when re-extracting from updated text. */
export function mergeExtractedContext(
  previous: ExtractedContext,
  next: ExtractedContext,
): ExtractedContext {
  return {
    environment:
      previous.environment.source === 'user' ? previous.environment : next.environment,
    browser: previous.browser.source === 'user' ? previous.browser : next.browser,
    os: previous.os.source === 'user' ? previous.os : next.os,
    device: previous.device.source === 'user' ? previous.device : next.device,
  }
}
