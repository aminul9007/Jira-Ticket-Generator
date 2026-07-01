import type { BugCategory, Environment } from '../types/bugReport'

export const BUG_CATEGORIES: readonly BugCategory[] = [
  'UI Bug',
  'Functional Bug',
  'Mobile Bug',
  'SEO Issue',
  'Accessibility Issue',
  'Performance Issue',
] as const

export const ENVIRONMENTS: readonly Environment[] = [
  'Canary',
  'Beta',
  'Production',
] as const

export const APP_NAME = 'QA Bug Report Assistant'
export const APP_TAGLINE = 'Generate Jira-ready bug reports faster'
export const PROJECT_AUTHOR = 'Md Aminul Islam'
export const PROJECT_AUTHOR_URL = 'https://www.linkedin.com/in/-md-aminul-islam'
export const PROJECT_ATTRIBUTION_PREFIX = 'Designed, Developed & Built by'
