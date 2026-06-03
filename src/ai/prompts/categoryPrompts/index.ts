import type { BugCategory } from '../../../types/bugReport'
import type { CategoryPromptGuide } from '../../types/promptTypes'
import {
  ACCESSIBILITY_ISSUE_GUIDE,
  FUNCTIONAL_BUG_GUIDE,
  MOBILE_BUG_GUIDE,
  PERFORMANCE_ISSUE_GUIDE,
  SEO_ISSUE_GUIDE,
  UI_BUG_GUIDE,
} from './guides'

export const CATEGORY_PROMPT_GUIDES: Record<BugCategory, CategoryPromptGuide> = {
  'UI Bug': UI_BUG_GUIDE,
  'Functional Bug': FUNCTIONAL_BUG_GUIDE,
  'Mobile Bug': MOBILE_BUG_GUIDE,
  'SEO Issue': SEO_ISSUE_GUIDE,
  'Accessibility Issue': ACCESSIBILITY_ISSUE_GUIDE,
  'Performance Issue': PERFORMANCE_ISSUE_GUIDE,
}

export function getCategoryPromptGuide(category: BugCategory): CategoryPromptGuide {
  return CATEGORY_PROMPT_GUIDES[category]
}

export function formatCategoryPromptSection(guide: CategoryPromptGuide): string {
  return [
    `## Category: ${guide.category}`,
    `Title prefix: ${guide.prefix}`,
    '',
    '### Focus areas',
    ...guide.focusAreas.map((item) => `- ${item}`),
    '',
    '### Title rules',
    ...guide.titleRules.map((item) => `- ${item}`),
    '',
    '### Title examples (match this style — adapt to input, do not copy verbatim)',
    ...guide.titleExamples.map((item, i) => `${i + 1}. ${item}`),
    '',
    '### Steps to reproduce rules',
    ...guide.stepsRules.map((item) => `- ${item}`),
    '',
    '### Example steps (structure only — replace with input-specific actions)',
    ...guide.stepsExample.map((item, i) => `${i + 1}. ${item}`),
    '',
    '### Severity guidance',
    ...guide.severityRules.map((item) => `- ${item}`),
    '',
    '### Priority guidance',
    ...guide.priorityRules.map((item) => `- ${item}`),
    '',
    '### Root cause guidance',
    ...guide.rootCauseRules.map((item) => `- ${item}`),
  ].join('\n')
}
