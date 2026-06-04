import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '../../utils/cn'

export interface DropdownItem {
  id: string
  label: string
  icon?: ReactNode
  onSelect: () => void
  isActive?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  className?: string
  menuClassName?: string
  'aria-label': string
}

export function Dropdown({
  trigger,
  items,
  align = 'end',
  className,
  menuClassName,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        close()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        className="inline-flex items-center"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            'absolute top-[calc(100%+0.375rem)] z-50 min-w-[11rem] overflow-hidden rounded-xl border border-border bg-dropdown-bg p-1 shadow-dropdown',
            align === 'end' ? 'right-0' : 'left-0',
            menuClassName,
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitemradio"
              {...(item.isActive
                ? { 'aria-checked': 'true' as const }
                : { 'aria-checked': 'false' as const })}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                'text-text-primary hover:bg-hover-surface focus-visible:outline-none focus-visible:bg-hover-surface',
                item.isActive && 'bg-brand-muted text-brand',
              )}
              onClick={() => {
                item.onSelect()
                close()
              }}
            >
              {item.icon && (
                <span className="flex size-4 shrink-0 items-center justify-center text-text-muted">
                  {item.icon}
                </span>
              )}
              <span className="flex-1 font-medium">{item.label}</span>
              {item.isActive && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 text-brand"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
