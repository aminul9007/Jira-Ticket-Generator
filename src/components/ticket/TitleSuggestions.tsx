import { Badge } from '../ui/Badge'

interface TitleSuggestionsProps {
  suggestions: [string, string, string]
  recommendedTitle: string
}

export function TitleSuggestions({
  suggestions,
  recommendedTitle,
}: TitleSuggestionsProps) {
  return (
    <div className="space-y-3">
      <p className="type-helper">
        Recommended title highlighted. Pick one when creating the Jira issue.
      </p>
      <ol className="space-y-2.5">
        {suggestions.map((title, index) => {
          const isRecommended = title === recommendedTitle
          return (
            <li
              key={index}
              className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-surface-elevated px-3.5 py-3"
            >
              <span className="type-helper mt-0.5 shrink-0 font-semibold tabular-nums">
                {index + 1}.
              </span>
              <span className="type-body flex-1 break-words font-medium leading-snug whitespace-normal">
                {title}
              </span>
              {isRecommended && (
                <Badge variant="brand" className="shrink-0">
                  Best fit
                </Badge>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
