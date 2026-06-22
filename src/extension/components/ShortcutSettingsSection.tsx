import { LoadingButton } from './LoadingButton'
import {
  formatShortcutLabel,
  OPEN_ASSISTANT_COMMAND_LABEL,
} from '../services/extensionShortcutService'
import { useExtensionShortcuts } from '../hooks/useExtensionShortcuts'

export function ShortcutSettingsSection() {
  const {
    loaded,
    effectiveShortcut,
    errorMessage,
    refresh,
    openShortcutSettings,
  } = useExtensionShortcuts()

  return (
    <section className="popup__settings-section">
      <h2 className="popup__footer-title">Keyboard Shortcut</h2>
      <p className="popup__settings-hint">
        Press this key combination anywhere in Chrome to open QA Bug Assistant. Chrome manages
        shortcuts — use Customize Shortcut to change them.
      </p>

      {!loaded || !effectiveShortcut ? (
        <div className="popup__loading-state popup__loading-state--inline" role="status">
          <span className="popup__spinner" aria-hidden="true" />
        </div>
      ) : (
        <>
          <div className="popup__shortcut-card">
            <p className="popup__shortcut-label">{OPEN_ASSISTANT_COMMAND_LABEL}</p>
            <p className="popup__shortcut-value">
              {effectiveShortcut.isAssigned ? (
                <kbd className="popup__kbd popup__kbd--active">
                  {formatShortcutLabel(effectiveShortcut.shortcut)}
                </kbd>
              ) : (
                <span className="popup__shortcut-unassigned">Not assigned</span>
              )}
            </p>
            {effectiveShortcut.statusMessage ? (
              <p className="popup__shortcut-status" role="status">
                {effectiveShortcut.statusMessage}
              </p>
            ) : null}
          </div>

          <div className="popup__settings-actions popup__settings-actions--stack">
            <LoadingButton
              isLoading={false}
              loadingLabel="Customize Shortcut"
              idleLabel="Customize Shortcut"
              variant="secondary"
              onClick={() => void openShortcutSettings()}
            />
            <LoadingButton
              isLoading={false}
              loadingLabel="Refresh Shortcut"
              idleLabel="Refresh Shortcut"
              variant="secondary"
              onClick={() => void refresh()}
            />
          </div>

          {errorMessage && (
            <p className="popup__settings-status popup__settings-status--error" role="status">
              {errorMessage}
            </p>
          )}

          <p className="popup__settings-hint" role="note">
            In Chrome shortcut settings, assign keys to <strong>Open QA Bug Assistant</strong> or
            <strong> Activate extension</strong> — both open this popup. After saving, click Refresh
            Shortcut here.
          </p>
        </>
      )}
    </section>
  )
}
