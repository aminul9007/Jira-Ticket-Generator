import { Card, CardHeader } from '../ui/Card'

export function TicketPreviewEmpty() {
  return (
    <Card
      id="ticket-preview"
      className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
    >
      <CardHeader
        title="Ticket Preview"
        description="Your generated Jira-ready ticket will appear here"
      />
      <div
        className="mx-auto flex max-w-xs flex-col items-center gap-3 px-4 pb-6"
        aria-live="polite"
      >
        <div
          className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-text-muted"
          aria-hidden="true"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5V5Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9 12H15M9 16H13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-sm text-text-secondary">
          Complete the form and click{' '}
          <span className="font-medium text-text-primary">Generate Ticket</span>{' '}
          to build a preview from your input.
        </p>
      </div>
    </Card>
  )
}
