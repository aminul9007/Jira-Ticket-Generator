import { LoadingButton } from './LoadingButton'
import {
  formatShortcutLabel,
  getSuggestedShortcutHint,
  OPEN_ASSISTANT_COMMAND_LABEL,
} from '../services/extensionShortcutService'
import { useExtensionShortcuts } from '../hooks/useExtensionShortcuts'

export function ShortcutSettingsSection() {
  const {
    loaded,
    commands,
    openAssistant,
    errorMessage,
    refresh,
    openShortcutSettings,
  } = useExtensionShortcuts()

  const suggestedShortcut = getSuggestedShortcutHint()

  return (
    <section className="popup__settings-section">
      <h2 className="popup__footer-title">Keyboard Shortcut</h2>
      <p className="popup__settings-hint">
        Chrome manages extension shortcuts. Use the button below to assign or change your key
        combination. Suggested default: <kbd className="popup__kbd">{suggestedShortcut}</kbd>
      </p>

      {!loaded ? (
        <div className="popup__loading-state popup__loading-state--inline" role="status">
          <span className="popup__spinner" aria-hidden="true" />
        </div>
      ) : (
        <>
          <div className="popup__shortcut-card">
            <p className="popup__shortcut-label">{OPEN_ASSISTANT_COMMAND_LABEL}</p>
            <p className="popup__shortcut-value">
              {openAssistant?.isAssigned ? (
                <kbd className="popup__kbd">{formatShortcutLabel(openAssistant.shortcut)}</kbd>
              ) : (
                <span className="popup__shortcut-unassigned">Not assigned</span>
              )}
            </p>
          </div>

          {commands.length > 1 && (
            <ul className="popup__shortcut-list">
              {commands.map((command) => (
                <li key={command.name} className="popup__shortcut-list-item">
                  <span>{command.description}</span>
                  <kbd className="popup__kbd">{formatShortcutLabel(command.shortcut)}</kbd>
                </li>
              ))}
            </ul>
          )}

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
            After changing the shortcut in Chrome, return here and click Refresh Shortcut. If the
            popup does not open from the keyboard, use the toolbar icon instead.
          </p>
        </>
      )}
    </section>
  )
}
