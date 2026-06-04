import { DEFAULT_APP_SETTINGS } from '../data/defaultAppSettings'
import type {
  AiOutputStyle,
  AiSettings,
  AppSettings,
  DefaultIssueType,
  HistoryRetentionCount,
  JiraSettings,
  SilenceTimeoutSeconds,
  TicketDefaultSettings,
  VoiceLanguage,
  VoiceSettings,
} from '../types/appSettings'
import { APP_SETTINGS_STORAGE_KEY } from '../types/appSettings'
import { loadProjectKnowledge } from './qaContextStorage'
import { formatLegacyKnowledgeAsProjectContext } from './projectContextFormat'

const OUTPUT_STYLES: AiOutputStyle[] = ['concise', 'standard', 'detailed']
const VOICE_LANGS: VoiceLanguage[] = ['en-US', 'en-GB']
const SILENCE_TIMEOUTS: SilenceTimeoutSeconds[] = [5, 10, 15]
const RETENTION_OPTIONS: HistoryRetentionCount[] = [30, 50, 100]
const ISSUE_TYPES: DefaultIssueType[] = ['Bug', 'Task', 'Story']

function normalizeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function normalizeEnum<T extends string | number>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string').map((s) => s.trim()).filter(Boolean)
}

function migrateProjectContext(raw: Partial<AppSettings>): string {
  const existing = normalizeString(raw.ai?.projectContext)
  if (existing.trim()) return existing

  try {
    return formatLegacyKnowledgeAsProjectContext(loadProjectKnowledge())
  } catch {
    return ''
  }
}

export function normalizeAppSettings(raw: Partial<AppSettings> | null | undefined): AppSettings {
  const base = DEFAULT_APP_SETTINGS
  const ai: Partial<AiSettings> = raw?.ai ?? {}
  const voice: Partial<VoiceSettings> = raw?.voice ?? {}
  const jira: Partial<JiraSettings> = raw?.jira ?? {}
  const ticketDefaults: Partial<TicketDefaultSettings> = raw?.ticketDefaults ?? {}
  const data: Partial<AppSettings['data']> = raw?.data ?? {}

  return {
    ai: {
      projectContext: migrateProjectContext(raw ?? {}),
      outputStyle: normalizeEnum(ai.outputStyle, OUTPUT_STYLES, base.ai.outputStyle),
      autoGenerateAfterVoice: normalizeBoolean(
        ai.autoGenerateAfterVoice,
        base.ai.autoGenerateAfterVoice,
      ),
    },
    voice: {
      language: normalizeEnum(voice.language, VOICE_LANGS, base.voice.language),
      silenceTimeoutSeconds: normalizeEnum(
        voice.silenceTimeoutSeconds,
        SILENCE_TIMEOUTS,
        base.voice.silenceTimeoutSeconds,
      ),
      showLiveTranscript: normalizeBoolean(
        voice.showLiveTranscript,
        base.voice.showLiveTranscript,
      ),
    },
    jira: {
      domain: normalizeString(jira.domain).trim(),
      email: normalizeString(jira.email).trim(),
      apiToken: normalizeString(jira.apiToken),
    },
    ticketDefaults: {
      projectKey: normalizeString(ticketDefaults.projectKey).trim().toUpperCase(),
      issueType: normalizeEnum(ticketDefaults.issueType, ISSUE_TYPES, base.ticketDefaults.issueType),
      labels: normalizeStringArray(ticketDefaults.labels),
      assignee: normalizeString(ticketDefaults.assignee).trim(),
    },
    data: {
      historyRetention: normalizeEnum(
        data.historyRetention,
        RETENTION_OPTIONS,
        base.data.historyRetention,
      ),
    },
  }
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(APP_SETTINGS_STORAGE_KEY)
    if (!raw) return normalizeAppSettings(null)
    return normalizeAppSettings(JSON.parse(raw) as Partial<AppSettings>)
  } catch {
    return { ...DEFAULT_APP_SETTINGS }
  }
}

export function saveAppSettings(settings: AppSettings): void {
  const next = normalizeAppSettings(settings)
  try {
    localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable */
  }
}

export function getSilenceTimeoutMs(settings?: AppSettings): number {
  const seconds = (settings ?? loadAppSettings()).voice.silenceTimeoutSeconds
  return seconds * 1000
}

export function getHistoryRetentionLimit(settings?: AppSettings): number {
  return (settings ?? loadAppSettings()).data.historyRetention
}

export function isAppSettingsConfigured(settings: AppSettings): boolean {
  return settings.ai.projectContext.trim().length > 0
}
