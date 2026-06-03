import { Card, CardHeader } from '../ui/Card'

const PreviewIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path
      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M9 12H15M9 16H13"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

export function TicketPreviewEmpty() {
  return (
    <Card
      id="ticket-preview"
      variant="outline"
      className="flex min-h-[420px] flex-col lg:min-h-[520px]"
    >
      <CardHeader
        title="Ticket Preview"
        description="Your generated Jira-ready ticket will appear here"
        icon={PreviewIcon}
      />

      <div
        className="flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-2 text-center"
        aria-live="polite"
      >
        <div className="relative mb-6">
          <div
            className="absolute inset-0 scale-150 rounded-full bg-brand/5 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="relative flex size-20 items-center justify-center rounded-2xl border border-dashed border-border-strong bg-surface-elevated text-text-muted shadow-sm"
            aria-hidden="true"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20M8 13H16M8 17H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-base font-semibold text-text-primary">
          No ticket generated yet
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
          Complete the form and click{' '}
          <span className="font-medium text-brand">Generate Ticket</span> to build
          a Jira-style preview from your input.
        </p>

        <ul className="mt-8 flex flex-col gap-2 text-left text-xs text-text-muted sm:items-center">
          {[
            'Category & environment',
            'Affected feature (recommended)',
            'Bug title & repro notes',
          ].map(
            (step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-brand-muted text-[10px] font-semibold text-brand">
                  {i + 1}
                </span>
                {step}
              </li>
            ),
          )}
        </ul>
      </div>
    </Card>
  )
}
