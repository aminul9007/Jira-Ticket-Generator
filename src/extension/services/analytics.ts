import { extensionConfig } from '../config/extensionConfig'
import { logger } from '../utils/logger'

export type AnalyticsEvent =
  | 'popup_opened'
  | 'settings_opened'
  | 'ticket_generated'
  | 'jira_created'
  | 'voice_started'
  | 'connection_tested'

/** Analytics abstraction — no external providers or user data collection in V1. */
export const analytics = {
  track(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void {
    if (!extensionConfig.features.analytics) return
    logger.info(`analytics.track:${event}`, properties)
  },
}
