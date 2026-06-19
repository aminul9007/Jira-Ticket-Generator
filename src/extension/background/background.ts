/**
 * Phase 2 foundation — Manifest V3 background service worker placeholder.
 * Command handling and popup orchestration will be added in later steps.
 */

console.debug('[QA Bug Assistant] background service worker loaded')

chrome.runtime.onInstalled.addListener(() => {
  console.debug('[QA Bug Assistant] extension installed or updated')
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-assistant') {
    // Phase 2 Step 2+: wire Ctrl+Shift+B to open the assistant popup.
    console.debug('[QA Bug Assistant] open-assistant command received')
  }
})
