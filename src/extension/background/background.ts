/**
 * QA Bug Assistant — MV3 background service worker.
 * Handles keyboard shortcut to open the popup when Chrome allows it.
 */

chrome.runtime.onInstalled.addListener(() => {
  // No-op: reserved for future migration notices.
})

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'open-assistant') return

  void chrome.action.openPopup().catch(() => {
    // Chrome may block programmatic popup open outside a direct user gesture.
    // Fallback: click the toolbar icon, or set the shortcut at chrome://extensions/shortcuts
  })
})
