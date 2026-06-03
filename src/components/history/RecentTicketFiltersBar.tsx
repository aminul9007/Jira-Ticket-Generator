import { BUG_CATEGORIES, ENVIRONMENTS } from '../../data/constants'
import type { RecentTicketFilters } from '../../types/recentTicket'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface RecentTicketFiltersBarProps {
  filters: RecentTicketFilters
  resultCount: number
  totalCount: number
  onSearchChange: (value: string) => void
  onCategoryChange: (value: RecentTicketFilters['category']) => void
  onEnvironmentChange: (value: RecentTicketFilters['environment']) => void
  onReset: () => void
}

export function RecentTicketFiltersBar({
  filters,
  resultCount,
  totalCount,
  onSearchChange,
  onCategoryChange,
  onEnvironmentChange,
  onReset,
}: RecentTicketFiltersBarProps) {
  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.category !== 'all' ||
    filters.environment !== 'all'

  return (
    <div className="space-y-3">
      <Input
        type="search"
        placeholder="Search titles, summary, feature, severity…"
        value={filters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search recent tickets"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          value={filters.category}
          onChange={(e) =>
            onCategoryChange(e.target.value as RecentTicketFilters['category'])
          }
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {BUG_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>

        <Select
          value={filters.environment}
          onChange={(e) =>
            onEnvironmentChange(
              e.target.value as RecentTicketFilters['environment'],
            )
          }
          aria-label="Filter by environment"
        >
          <option value="all">All environments</option>
          {ENVIRONMENTS.map((env) => (
            <option key={env} value={env}>
              {env}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
        <span>
          Showing {resultCount} of {totalCount} recent ticket
          {totalCount === 1 ? '' : 's'}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="font-medium text-brand hover:text-brand-hover"
            onClick={onReset}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
