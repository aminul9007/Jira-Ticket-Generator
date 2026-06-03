import { APP_NAME, APP_TAGLINE } from '../../data/constants'
import type { AppPage } from '../../types/appPage'
import { cn } from '../../utils/cn'
import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  activePage?: AppPage
  onNavigate?: (page: AppPage) => void
}

export function Header({ activePage = 'dashboard', onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface-elevated/90 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex min-w-0 items-center gap-3 text-left"
            onClick={() => onNavigate?.('dashboard')}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-brand/25"
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
          </button>
        </div>

        <div className="flex items-center gap-2">
          <nav className="mr-1 hidden items-center gap-1 sm:flex" aria-label="Main">
            <button
              type="button"
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                activePage === 'dashboard'
                  ? 'bg-brand-muted text-brand'
                  : 'text-text-secondary hover:bg-hover-surface hover:text-text-primary',
              )}
              onClick={() => onNavigate?.('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                activePage === 'settings'
                  ? 'bg-brand-muted text-brand'
                  : 'text-text-secondary hover:bg-hover-surface hover:text-text-primary',
              )}
              onClick={() => onNavigate?.('settings')}
            >
              Settings
            </button>
          </nav>

          {onNavigate && (
            <button
              type="button"
              className="rounded-lg border border-border bg-surface-subtle px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-hover-border hover:bg-hover-surface hover:text-text-primary sm:hidden"
              onClick={() =>
                onNavigate(activePage === 'dashboard' ? 'settings' : 'dashboard')
              }
            >
              {activePage === 'dashboard' ? 'Settings' : 'Dashboard'}
            </button>
          )}

          <ThemeToggle />
          <span className="hidden rounded-full bg-brand-muted px-3 py-1 text-xs font-medium text-brand lg:inline-flex">
            Beta
          </span>
        </div>
      </div>
    </header>
  )
}
