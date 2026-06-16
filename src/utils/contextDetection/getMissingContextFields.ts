import type { Environment } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'

export type MissingContextField = 'environment' | 'browser' | 'os' | 'device'

export const MISSING_CONTEXT_FIELD_LABELS: Record<
  MissingContextField,
  { title: string; hint: string; examples: string }
> = {
  environment: {
    title: 'Environment',
    hint: 'Which environment was affected?',
    examples: 'e.g. production, beta, staging, canary',
  },
  browser: {
    title: 'Browser',
    hint: 'Which browser did you use?',
    examples: 'e.g. Chrome, Safari, Firefox, Edge',
  },
  os: {
    title: 'Operating system',
    hint: 'Which OS was this on?',
    examples: 'e.g. Windows, macOS, iOS, Android',
  },
  device: {
    title: 'Device type',
    hint: 'What kind of device was this?',
    examples: 'e.g. desktop, mobile, tablet',
  },
}

function isUnknownContextValue(value: string): boolean {
  return value === 'Unknown' || value === 'unknown'
}

export function getMissingContextFields(
  qaContext: ExtractedContext,
  environments: Environment[],
): MissingContextField[] {
  const missing: MissingContextField[] = []

  if (isUnknownContextValue(qaContext.environment.value) && environments.length === 0) {
    missing.push('environment')
  }
  if (isUnknownContextValue(qaContext.browser.value)) {
    missing.push('browser')
  }
  if (isUnknownContextValue(qaContext.os.value)) {
    missing.push('os')
  }
  if (isUnknownContextValue(qaContext.device.value)) {
    missing.push('device')
  }

  return missing
}
