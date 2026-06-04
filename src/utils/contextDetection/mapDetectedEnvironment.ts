import type { Environment } from '../../types/bugReport'
import type { DetectedEnvironment } from '../../types/contextDetection'

export function mapDetectedEnvironmentToLegacy(
  value: DetectedEnvironment,
): Environment[] {
  switch (value) {
    case 'production':
      return ['Production']
    case 'canary':
      return ['Canary']
    case 'beta':
    case 'staging':
    case 'qa':
    case 'development':
      return ['Beta']
    case 'unknown':
      return []
  }
}
