import { APP_NAME } from '../../data/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-surface-elevated">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-text-muted sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p>
          © {year} {APP_NAME}. Built for QA teams.
        </p>
        <p>AI & Jira integration coming in a future phase.</p>
      </div>
    </footer>
  )
}
