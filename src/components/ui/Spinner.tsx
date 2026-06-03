import { cn } from '../../utils/cn'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizeStyles = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[2.5px]',
}

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span
        className={cn(
          'animate-spin rounded-full border-current border-t-transparent',
          sizeStyles[size],
          className,
        )}
        aria-hidden="true"
      />
      {label && <span className="sr-only">{label}</span>}
    </span>
  )
}
