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
    <div className="space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-wrap leading-7">
          <FormattedTicketText text={paragraph} />
        </p>
      ))}
    </div>
  )
}

export function FormattedTicketList({ items }: { items: string[] }): ReactNode {
  return (
    <ol className="list-decimal space-y-2.5 pl-5 marker:text-text-muted marker:font-medium">
      {items.map((step, index) => (
        <li key={index} className="pl-1 leading-7">
          <FormattedTicketText text={step} />
        </li>
      ))}
    </ol>
  )
}
