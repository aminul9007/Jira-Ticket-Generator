import type { HealthWarning } from '../services/extensionHealthService'

interface HealthBannerProps {
  warnings: HealthWarning[]
  onDismiss: () => void
  onOpenSettings?: () => void
}

export function HealthBanner({ warnings, onDismiss, onOpenSettings }: HealthBannerProps) {
  if (warnings.length === 0) return null

  return (
    <div className="popup__health-banner" role="status" aria-live="polite">
      <div className="popup__health-banner-content">
        {warnings.map((warning) => (
          <p key={warning.code} className="popup__health-banner-message">
            {warning.message}
          </p>
        ))}
        {onOpenSettings && (
          <button type="button" className="popup__health-banner-link" onClick={onOpenSettings}>
            Open Settings
          </button>
        )}
      </div>
      <button
        type="button"
        className="popup__health-banner-dismiss"
        aria-label="Dismiss warnings"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  )
}
