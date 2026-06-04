import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/25 active:scale-[0.99] focus-visible:ring-brand focus-visible:ring-offset-surface-elevated',
  secondary:
    'border border-border-strong bg-surface-elevated text-text-primary shadow-sm hover:border-hover-border hover:bg-hover-surface focus-visible:ring-brand/40 focus-visible:ring-offset-surface-elevated',
  ghost:
    'text-text-secondary hover:bg-hover-surface hover:text-text-primary focus-visible:ring-brand/40 focus-visible:ring-offset-surface-elevated',
  danger:
    'border border-danger/40 bg-danger/10 text-danger hover:bg-danger/15 focus-visible:ring-danger/30 focus-visible:ring-offset-surface-elevated',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs rounded-lg',
  md: 'h-10 gap-2 px-4 text-sm rounded-xl',
  lg: 'h-12 gap-2.5 px-6 text-sm font-semibold rounded-xl',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner
          size={size === 'lg' ? 'md' : 'sm'}
          className={variant === 'primary' ? 'text-white' : 'text-brand'}
        />
      ) : null}
      <span className={isLoading ? 'opacity-80' : undefined}>{children}</span>
    </button>
  )
}
