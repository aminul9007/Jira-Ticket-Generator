import { APP_NAME } from '../../data/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/80 bg-surface-elevated/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-xs text-text-muted">
          © {year} {APP_NAME}
        </p>
        <p className="text-xs text-text-muted">
          AI & Jira integration — coming soon
        </p>
      </div>
    </footer>
  )
}
