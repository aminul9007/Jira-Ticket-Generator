import { APP_NAME } from '../../data/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/80 bg-surface-elevated/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="type-helper">
          © {year} {APP_NAME}
        </p>
        <p className="type-helper flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-end">
          <a
            href="/about/about.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            About &amp; project structure
          </a>
          <span aria-hidden="true">·</span>
          <span>Local llama.cpp or OpenAI · Jira via MCP</span>
        </p>
      </div>
    </footer>
  )
}
