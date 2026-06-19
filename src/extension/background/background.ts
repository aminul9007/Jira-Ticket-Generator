import { logger } from '../utils/logger'

chrome.runtime.onInstalled.addListener(() => {
  logger.info('Extension installed or updated')
})

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'open-assistant') return

  void chrome.action.openPopup().catch(() => {
    logger.warn('Could not open popup from keyboard shortcut — use the toolbar icon instead')
  })
})
