import type { ReactNode } from 'react'

interface FormattedTicketTextProps {
  text: string
}

/** Renders *wiki-style* emphasis for Jira-like preview text. */
export function FormattedTicketText({ text }: FormattedTicketTextProps) {
  const parts = text.split(/(\*[^*]+\*)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <strong key={index} className="font-semibold text-text-primary">
              {part.slice(1, -1)}
            </strong>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

export function FormattedTicketBlock({ text }: FormattedTicketTextProps) {
  const paragraphs = text.split(/\n\n+/)

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-wrap">
          <FormattedTicketText text={paragraph} />
        </p>
      ))}
    </div>
  )
}

export function FormattedTicketList({ items }: { items: string[] }): ReactNode {
  return (
    <ol className="list-decimal space-y-2 pl-5 marker:text-text-muted">
      {items.map((step, index) => (
        <li key={index} className="pl-1">
          <FormattedTicketText text={step} />
        </li>
      ))}
    </ol>
  )
}
