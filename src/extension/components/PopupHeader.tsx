interface PopupHeaderProps {
  subtitle: string
  onOpenSettings?: () => void
  onCreateTicket?: () => void
}

export function PopupHeader({ subtitle, onOpenSettings, onCreateTicket }: PopupHeaderProps) {
  return (
    <header className="popup__header">
      <div className="popup__brand">
        <img
          className="popup__brand-icon"
          src={chrome.runtime.getURL('icons/icon-32.png')}
          alt=""
          width={28}
          height={28}
        />
        <div>
          <h1 className="popup__title">QA Bug Assistant</h1>
          <p className="popup__subtitle">{subtitle}</p>
        </div>
      </div>
      {(onOpenSettings || onCreateTicket) && (
        <div className="popup__header-side">
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
