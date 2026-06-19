interface LoadingButtonProps {
  isLoading: boolean
  loadingLabel: string
  idleLabel: string
  disabled?: boolean
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function LoadingButton({
  isLoading,
  loadingLabel,
  idleLabel,
  disabled = false,
  onClick,
  variant = 'primary',
}: LoadingButtonProps) {
  const className =
    variant === 'primary'
      ? 'popup__generate-button popup__generate-button--active'
      : 'popup__secondary-button'

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <span className="popup__button-content">
          <span className="popup__spinner" aria-hidden="true" />
          {loadingLabel}
        </span>
      ) : (
        idleLabel
      )}
    </button>
  )
}
