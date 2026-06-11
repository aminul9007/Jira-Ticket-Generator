import { createContext } from 'react'
import type { AppSettings } from '../types/appSettings'

export interface AppSettingsContextValue {
  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings> | ((prev: AppSettings) => Partial<AppSettings>)) => void
  updateAi: (patch: Partial<AppSettings['ai']>) => void
  updateVoice: (patch: Partial<AppSettings['voice']>) => void
  updateJira: (patch: Partial<AppSettings['jira']>) => void
  updateTicketDefaults: (patch: Partial<AppSettings['ticketDefaults']>) => void
  updateTicketTemplate: (patch: Partial<AppSettings['ticketTemplate']>) => void
  updateData: (patch: Partial<AppSettings['data']>) => void
  resetSettings: () => void
}

export const AppSettingsContext = createContext<AppSettingsContextValue | null>(null)
