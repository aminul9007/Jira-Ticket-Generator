import { APP_NAME, APP_TAGLINE } from '../../data/constants'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface-elevated/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-white shadow-md shadow-brand/25"
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
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
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-text-primary">
              {APP_NAME}
            </p>
            <p className="hidden truncate text-xs text-text-muted sm:block">
              {APP_TAGLINE}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-brand-muted px-3 py-1 text-xs font-medium text-brand sm:inline-flex">
            Beta
          </span>
          <span className="rounded-full border border-border bg-surface-subtle px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted sm:px-3 sm:text-xs">
            Phase 1
          </span>
        </div>
      </div>
    </header>
  )
}
