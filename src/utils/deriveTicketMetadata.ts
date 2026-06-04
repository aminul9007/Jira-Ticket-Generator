import type {
  BugCategory,
  Environment,
  TicketPriority,
  TicketSeverity,
} from '../types/bugReport'

interface TicketMetadata {
  severity: TicketSeverity
  priority: TicketPriority
}

const CATEGORY_DEFAULTS: Record<
  BugCategory,
  TicketMetadata
> = {
  'Functional Bug': { severity: 'High', priority: 'P2' },
  'Performance Issue': { severity: 'High', priority: 'P2' },
  'UI Bug': { severity: 'Medium', priority: 'P3' },
  'Mobile Bug': { severity: 'Medium', priority: 'P3' },
  'Accessibility Issue': { severity: 'Medium', priority: 'P3' },
  'SEO Issue': { severity: 'Low', priority: 'P4' },
}

const SEVERITY_ORDER: TicketSeverity[] = [
  'Low',
  'Medium',
  'High',
  'Critical',
]

const PRIORITY_ORDER: TicketPriority[] = ['P4', 'P3', 'P2', 'P1', 'P0']

function bumpSeverity(severity: TicketSeverity): TicketSeverity {
  const index = SEVERITY_ORDER.indexOf(severity)
  return SEVERITY_ORDER[Math.min(index + 1, SEVERITY_ORDER.length - 1)]
}

function raisePriority(priority: TicketPriority): TicketPriority {
  const index = PRIORITY_ORDER.indexOf(priority)
  return PRIORITY_ORDER[Math.max(index - 1, 0)]
}

export function deriveTicketMetadata(
  category: BugCategory,
  environments: Environment[],
): TicketMetadata {
  let { severity, priority } = CATEGORY_DEFAULTS[category]

  if (environments.includes('Production')) {
    severity = bumpSeverity(severity)
    priority = raisePriority(priority)
  }

  if (
    environments.includes('Canary') &&
    !environments.includes('Production') &&
    !environments.includes('Beta')
  ) {
    const index = SEVERITY_ORDER.indexOf(severity)
    severity = SEVERITY_ORDER[Math.max(index - 1, 0)]
  }

  return { severity, priority }
}
