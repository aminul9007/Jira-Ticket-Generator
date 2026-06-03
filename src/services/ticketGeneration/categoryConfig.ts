import type { BugCategory } from '../../types/bugReport'

export const CATEGORY_PREFIX: Record<BugCategory, string> = {
  'UI Bug': '[UI]',
  'Functional Bug': '[FUNC]',
  'Mobile Bug': '[MOBILE]',
  'SEO Issue': '[SEO]',
  'Accessibility Issue': '[A11Y]',
  'Performance Issue': '[PERF]',
}

export const ROOT_CAUSE_HINTS: Record<BugCategory, string[]> = {
  'UI Bug': [
    'CSS/layout regression or responsive breakpoint issue',
    'Component state not updating after user interaction',
    'Design token or theme mismatch between environments',
  ],
  'Functional Bug': [
    'API contract change or error response not handled in UI',
    'Validation rule or business logic regression',
    'Race condition or stale cache in client/server flow',
  ],
  'Mobile Bug': [
    'Mobile-specific viewport or touch event handling',
    'Safari/WebView compatibility or polyfill gap',
    'Native wrapper bridge or device OS version behavior',
  ],
  'SEO Issue': [
    'Meta tags, canonical URLs, or sitemap misconfiguration',
    'Client-side rendering blocking crawler indexing',
    'Redirect chain or robots.txt blocking key pages',
  ],
  'Accessibility Issue': [
    'Missing ARIA labels, roles, or focus management',
    'Color contrast or keyboard trap in interactive elements',
    'Screen reader announcement order incorrect',
  ],
  'Performance Issue': [
    'Unoptimized asset bundle or render-blocking resources',
    'N+1 API calls or missing pagination on large datasets',
    'Memory leak or excessive re-renders in UI layer',
  ],
}
