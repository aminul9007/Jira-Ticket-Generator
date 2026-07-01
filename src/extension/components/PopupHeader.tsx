interface PopupHeaderProps {
  subtitle: string
  onOpenAbout?: () => void
  onOpenSettings?: () => void
  onCreateTicket?: () => void
}

export function PopupHeader({
  subtitle,
  onOpenAbout,
  onOpenSettings,
  onCreateTicket,
}: PopupHeaderProps) {
  const showHeaderSide = onOpenAbout || onOpenSettings || onCreateTicket

  return (
    <header className="popup__header">
      <div className="popup__brand">
        <img
          className="popup__brand-icon"
          src={chrome.runtime.getURL('icons/icon-128.png')}
          alt=""
          width={28}
          height={28}
        />
        <div>
          <h1 className="popup__title">QA Bug Assistant</h1>
          <p className="popup__subtitle">{subtitle}</p>
        </div>
      </div>
      {showHeaderSide && (
        <div className="popup__header-side">
          {(onOpenAbout || onOpenSettings) && (
            <div className="popup__header-actions-row">
              {onOpenAbout && (
                <button
                  type="button"
                  className="popup__info-button"
                  aria-label="About project"
                  title="About project"
                  onClick={onOpenAbout}
                >
                  ⓘ
                </button>
              )}
              {onOpenSettings && (
                <button
                  type="button"
                  className="popup__settings-button"
                  aria-label="Open settings"
                  title="Settings"
                  onClick={onOpenSettings}
                >
                  ⚙
                </button>
              )}
            </div>
          )}
          {onCreateTicket && (
            <button
              type="button"
              className="popup__new-ticket-button"
              onClick={onCreateTicket}
            >
              New ticket
            </button>
          )}
        </div>
      )}
    </header>
  )
}
