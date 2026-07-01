import { PROJECT_AUTHOR, PROJECT_AUTHOR_URL } from '../data/constants'

interface AuthorLinkProps {
  className?: string
}

export function AuthorLink({ className }: AuthorLinkProps) {
  return (
    <a
      href={PROJECT_AUTHOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {PROJECT_AUTHOR}
    </a>
  )
}
