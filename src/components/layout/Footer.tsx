import { APP_NAME, PROJECT_ATTRIBUTION_PREFIX } from '../../data/constants'
import { AuthorLink } from '../AuthorLink'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/80 bg-surface-elevated/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:items-end sm:px-6 sm:text-left lg:px-8">
        <div className="space-y-0.5">
          <p className="type-helper">
            {PROJECT_ATTRIBUTION_PREFIX}{' '}
            <AuthorLink className="font-medium text-text-primary hover:text-accent hover:underline" />
          </p>
          <p className="type-helper text-text-muted">
            © {year} {APP_NAME}
          </p>
        </div>
        <p className="type-helper flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-end">
          <a
            href="/about/about.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            About &amp; project structure
          </a>
          <span aria-hidden="true" className="text-text-muted">
            ·
          </span>
          <span className="text-text-muted">Local llama.cpp or OpenAI · Jira via MCP</span>
        </p>
      </div>
    </footer>
  )
}
