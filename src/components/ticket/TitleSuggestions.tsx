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
    <div className="space-y-2">
      <p className="text-xs text-text-muted">
        Recommended title highlighted. Pick one when creating the Jira issue.
      </p>
      <ol className="space-y-2">
        {suggestions.map((title, index) => {
          const isRecommended = title === recommendedTitle
          return (
            <li
              key={index}
              className="flex items-start gap-2 rounded-lg border border-border/70 bg-surface-elevated px-3 py-2.5 text-sm"
            >
              <span className="mt-0.5 shrink-0 text-xs font-semibold tabular-nums text-text-muted">
                {index + 1}.
              </span>
              <span className="flex-1 font-medium leading-snug text-text-primary">
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
