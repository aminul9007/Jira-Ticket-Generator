import { APP_NAME, APP_TAGLINE } from '../../data/constants'

export function Header() {
  return (
    <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L3 7V12C3 16.97 6.84 21.43 12 22C17.16 21.43 21 16.97 21 12V7L12 2Z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              {APP_NAME}
            </h1>
            <p className="text-sm text-text-secondary">{APP_TAGLINE}</p>
          </div>
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted sm:text-right">
          Phase 1 · Frontend MVP
        </p>
      </div>
    </header>
  )
}
