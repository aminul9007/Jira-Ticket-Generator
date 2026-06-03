import type { CategoryPromptGuide } from '../../types/promptTypes'

export const UI_BUG_GUIDE: CategoryPromptGuide = {
  category: 'UI Bug',
  prefix: '[UI]',
  focusAreas: [
    'Visual layout, alignment, spacing, typography, colors, icons',
    'Interactive states: hover, focus, disabled, loading, empty',
    'Responsive breakpoints and component consistency',
  ],
  titleRules: [
    'Include [UI] prefix and affected screen/component',
    'Name the visible symptom (misaligned, overlapping, truncated, wrong color)',
    'Keep under 90 characters',
  ],
  titleExamples: [
    '[UI] Checkout — Submit button misaligned on tablet viewport',
    '[UI] Profile Settings — Avatar crop overlay clipped on mobile',
    '[UI][Production] Cart drawer — Discount badge text truncated',
  ],
  stepsRules: [
    'Start with environment and viewport/device if mentioned in notes',
    'Navigate to the specific page or component',
    'Describe exact UI interaction and what renders incorrectly',
    'End with "Compare against design spec / expected layout"',
  ],
  stepsExample: [
    'Open the application in the Beta environment on a 768px viewport.',
    'Navigate to Checkout.',
    'Scroll to the payment section and observe the Submit order button alignment.',
    'Compare button position against the design spec — note horizontal offset.',
  ],
  severityRules: [
    'High/Critical if primary CTA is broken or blocks conversion in Production',
    'Medium for cosmetic issues that do not block task completion',
    'Low for minor pixel-level deviations on non-critical screens',
  ],
  priorityRules: [
    'P1/P2 when Production checkout, login, or payment UI is affected',
    'P3 for Beta-only visual regressions on secondary screens',
    'P4 for Canary cosmetic polish items',
  ],
  rootCauseRules: [
    'CSS regression, design token drift, responsive breakpoint miscalculation',
    'Component state not updating visual class',
    'Mark "Possible:" for unconfirmed causes',
  ],
}

export const FUNCTIONAL_BUG_GUIDE: CategoryPromptGuide = {
  category: 'Functional Bug',
  prefix: '[FUNC]',
  focusAreas: [
    'Workflow completion, validations, business rules, data persistence',
    'API/UI integration errors, error handling, edge cases',
    'Permissions, auth gates, and state transitions',
  ],
  titleRules: [
    'Use [FUNC] prefix and name the broken workflow',
    'State what action fails (cannot save, validation loop, wrong redirect)',
  ],
  titleExamples: [
    '[FUNC] Checkout — Order fails silently after payment confirmation',
    '[FUNC] User Registration — Email verification link returns 404',
    '[FUNC][Production] Inventory sync — Stock count not updating after sale',
  ],
  stepsRules: [
    'Define preconditions only if provided in input',
    'List sequential user actions that trigger the failure',
    'Include observed system behavior (error toast, no response, wrong data)',
    'Note if issue is intermittent only when stated in notes',
  ],
  stepsExample: [
    'Open the application in Production.',
    'Navigate to Checkout and add a valid item to the cart.',
    'Complete shipping details and click Place order.',
    'Observe that no confirmation appears and the order is not created.',
  ],
  severityRules: [
    'Critical if core revenue/auth/data-integrity workflow is blocked in Production',
    'High if workaround exists but affects many users',
    'Medium/Low for edge cases with narrow scope',
  ],
  priorityRules: [
    'P1 when Production payment, login, or data loss risk',
    'P2 for major feature broken in Beta with Production imminent',
    'P3/P4 for isolated edge cases in pre-production',
  ],
  rootCauseRules: [
    'API contract change, validation rule regression, race condition',
    'Stale cache or incorrect error handling in client',
  ],
}

export const MOBILE_BUG_GUIDE: CategoryPromptGuide = {
  category: 'Mobile Bug',
  prefix: '[MOBILE]',
  focusAreas: [
    'Touch targets, gestures, mobile Safari/Chrome/WebView quirks',
    'Orientation changes, keyboard overlap, native wrapper issues',
    'Device-specific layout and performance on small screens',
  ],
  titleRules: [
    'Use [MOBILE] prefix; include device/browser only if provided in notes',
    'Describe mobile-specific symptom (keyboard covers input, tap unresponsive)',
  ],
  titleExamples: [
    '[MOBILE] Login — Keyboard covers password field on iOS Safari',
    '[MOBILE] Product Gallery — Swipe gesture not registering on Android Chrome',
    '[MOBILE][Beta] Checkout — Place order button disabled after autofill',
  ],
  stepsRules: [
    'Specify mobile browser/device ONLY if given in Additional Notes',
    'Otherwise write "Using mobile browser (confirm device/OS with reporter)"',
    'Include orientation or keyboard steps when relevant to category',
  ],
  stepsExample: [
    'Open the site in Beta on a mobile device (confirm OS/browser with reporter).',
    'Navigate to Login.',
    'Tap the password field and observe keyboard behavior.',
    'Verify whether the password field remains visible and tappable.',
  ],
  severityRules: [
    'High if mobile checkout/login is blocked',
    'Medium for degraded but usable mobile experience',
    'Lower when desktop works and mobile is secondary channel',
  ],
  priorityRules: [
    'Elevate priority when Production mobile traffic is significant (assume mobile matters unless noted)',
    'P2/P3 typical for mobile-only regressions in Beta',
  ],
  rootCauseRules: [
    'Touch event handling, viewport meta, iOS Safari quirk, WebView bridge',
  ],
}

export const SEO_ISSUE_GUIDE: CategoryPromptGuide = {
  category: 'SEO Issue',
  prefix: '[SEO]',
  focusAreas: [
    'Meta tags, canonical URLs, indexing, sitemap, structured data',
    'Crawler visibility, redirects, robots.txt, hreflang',
    'Page title/description accuracy for public pages',
  ],
  titleRules: [
    'Use [SEO] prefix and name the page or URL path if known',
    'State the SEO element affected (missing meta, wrong canonical, noindex)',
  ],
  titleExamples: [
    '[SEO] /pricing — Missing meta description on public page',
    '[SEO] Product pages — Canonical URL points to staging domain',
    '[SEO][Production] Blog — Article pages excluded from sitemap',
  ],
  stepsRules: [
    'Identify the public URL or page name from input only',
    'Steps should include how to inspect (view source, Search Console) without inventing tools access',
    'Compare expected SEO element vs observed',
  ],
  stepsExample: [
    'Open the Production site and navigate to /pricing (or confirm URL with reporter).',
    'View page source or SEO inspection tool output.',
    'Check meta description tag presence and content.',
    'Compare against SEO requirements for public marketing pages.',
  ],
  severityRules: [
    'Medium/High if Production indexation of revenue pages is affected',
    'Low for minor metadata on low-traffic pages',
  ],
  priorityRules: [
    'P2/P3 for Production SEO on key landing pages',
    'P4 for pre-production or low-impact metadata',
  ],
  rootCauseRules: [
    'SSR/CSR meta injection failure, wrong env config, redirect chain',
  ],
}

export const ACCESSIBILITY_ISSUE_GUIDE: CategoryPromptGuide = {
  category: 'Accessibility Issue',
  prefix: '[A11Y]',
  focusAreas: [
    'Keyboard navigation, focus order, screen reader labels',
    'Color contrast, ARIA roles, form errors announced',
    'WCAG 2.1 AA alignment — do not cite specific WCAG IDs unless sure',
  ],
  titleRules: [
    'Use [A11Y] prefix and the inaccessible control or flow',
    'Name the barrier (keyboard trap, missing label, low contrast)',
  ],
  titleExamples: [
    '[A11Y] Checkout — Coupon field missing accessible name',
    '[A11Y] Modal dialog — Focus not trapped, background scrolls',
    '[A11Y][Production] Main nav — Dropdown not operable via keyboard',
  ],
  stepsRules: [
    'Include keyboard-only or screen reader steps when notes mention them',
    'Otherwise: "Test with keyboard Tab/Enter (assistive tech: confirm with reporter)"',
    'Describe expected accessible behavior vs actual',
  ],
  stepsExample: [
    'Open Checkout in Beta.',
    'Navigate to the coupon code field using keyboard Tab only.',
    'Attempt to activate Apply coupon with Enter/Space.',
    'Observe whether focus order and control labels meet accessible interaction expectations.',
  ],
  severityRules: [
    'High if core flow is blocked for assistive technology users in Production',
    'Medium for partial barriers with workaround',
    'Legal/compliance risk may elevate severity — note if Production public form',
  ],
  priorityRules: [
    'P2 for Production checkout/login accessibility blockers',
    'P3 for Beta findings on secondary flows',
  ],
  rootCauseRules: [
    'Missing aria-label, incorrect role, focus management bug, contrast token',
  ],
}

export const PERFORMANCE_ISSUE_GUIDE: CategoryPromptGuide = {
  category: 'Performance Issue',
  prefix: '[PERF]',
  focusAreas: [
    'Load time, TTFB, LCP, interaction delay, jank, memory',
    'Large payloads, N+1 requests, unoptimized assets',
    'Do NOT invent metrics — use qualitative terms unless numbers are in notes',
  ],
  titleRules: [
    'Use [PERF] prefix and the slow page/action',
    'Describe slowness qualitatively unless metrics provided',
  ],
  titleExamples: [
    '[PERF] Dashboard — Initial load exceeds acceptable threshold',
    '[PERF] Search results — Filter interaction causes multi-second delay',
    '[PERF][Production] Checkout — Payment step spinner persists after response',
  ],
  stepsRules: [
    'Never invent load times (e.g. "5 seconds") unless in Additional Notes',
    'Use "Observe delayed response" or cite reporter-provided timings',
    'Include network throttling only if mentioned in input',
  ],
  stepsExample: [
    'Open Dashboard in Production (cold cache if noted by reporter).',
    'Measure or observe initial page readiness (confirm metrics with reporter).',
    'Compare against expected performance baseline for this page.',
    'Document whether delay occurs on first load, navigation, or interaction.',
  ],
  severityRules: [
    'Critical/High if Production checkout or login is unusably slow',
    'Medium for noticeable delay on non-critical paths',
    'Low for minor latency within acceptable range',
  ],
  priorityRules: [
    'P1/P2 when Production core funnel performance regresses',
    'P3 for Beta performance debt on secondary features',
  ],
  rootCauseRules: [
    'Bundle size regression, unbounded API fetch, missing cache, memory leak',
  ],
}
