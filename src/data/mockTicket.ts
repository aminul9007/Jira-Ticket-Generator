import type { GeneratedTicket } from '../types/bugReport'

export const MOCK_TICKET: GeneratedTicket = {
  title: '[UI] Checkout button disabled on mobile Safari',
  issueSummary:
    'On mobile Safari (iOS 17+), the primary checkout button remains disabled after a valid shipping address is entered. Users cannot complete purchase flow in Beta and Production environments.',
  stepsToReproduce: [
    'Open the storefront on mobile Safari (iOS 17 or later).',
    'Add any item to cart and navigate to checkout.',
    'Enter a valid shipping address with all required fields completed.',
    'Observe the "Place Order" button state.',
  ],
  expectedResult:
    'The "Place Order" button becomes enabled once all required checkout fields are valid, allowing the user to submit the order.',
  actualResult:
    'The "Place Order" button stays disabled (grayed out) despite valid form input. No validation error messages are shown.',
  severity: 'High',
  priority: 'P2',
  category: 'UI Bug',
  environments: ['Beta', 'Production'],
}
