import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
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
    'bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/25 active:scale-[0.99] focus-visible:ring-brand',
  secondary:
    'border border-border-strong bg-surface-elevated text-text-primary shadow-sm hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost:
    'text-text-secondary hover:bg-slate-100/80 hover:text-text-primary focus-visible:ring-slate-400',
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
