interface PopupHeaderProps {
  subtitle: string
}

export function PopupHeader({ subtitle }: PopupHeaderProps) {
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
    </header>
  )
}
