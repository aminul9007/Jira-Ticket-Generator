export type DetectionSource = 'user' | 'auto-detected' | 'default' | 'unknown'

export type DetectedBrowser = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Unknown'

export type DetectedOs = 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown'

export type DetectedDevice = 'Desktop' | 'Mobile' | 'Tablet' | 'Unknown'

export type DetectedEnvironment =
  | 'production'
  | 'staging'
  | 'beta'
  | 'canary'
  | 'qa'
  | 'development'
  | 'unknown'

export interface DetectedField<T extends string> {
  value: T
  source: DetectionSource
}

export interface ExtractedContext {
  environment: DetectedField<DetectedEnvironment>
  browser: DetectedField<DetectedBrowser>
  os: DetectedField<DetectedOs>
  device: DetectedField<DetectedDevice>
}

export const DETECTED_ENVIRONMENT_OPTIONS: readonly DetectedEnvironment[] = [
  'production',
  'staging',
  'beta',
  'canary',
  'qa',
  'development',
  'unknown',
] as const

export function formatDetectedEnvironmentLabel(value: DetectedEnvironment): string {
  if (value === 'unknown') return 'Unknown'
  if (value === 'qa') return 'QA'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const DETECTED_BROWSER_OPTIONS: readonly DetectedBrowser[] = [
  'Chrome',
  'Firefox',
  'Safari',
  'Edge',
  'Unknown',
] as const

export const DETECTED_OS_OPTIONS: readonly DetectedOs[] = [
  'Windows',
  'macOS',
  'Linux',
  'Android',
  'iOS',
  'Unknown',
] as const

export const DETECTED_DEVICE_OPTIONS: readonly DetectedDevice[] = [
  'Desktop',
  'Mobile',
  'Tablet',
  'Unknown',
] as const

export function formatDetectionSourceBadge(source: DetectionSource): string | null {
  switch (source) {
    case 'default':
      return 'Default'
    case 'auto-detected':
      return 'Detected'
    case 'user':
      return null
    case 'unknown':
      return null
  }
}
