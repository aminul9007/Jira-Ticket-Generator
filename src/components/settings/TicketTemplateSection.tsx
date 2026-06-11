import { useAppSettings } from '../../hooks/useAppSettings'
import type { TicketTemplateFieldKey, TicketTemplatePreset } from '../../types/appSettings'
import {
  TICKET_TEMPLATE_FIELD_META,
  TICKET_TEMPLATE_FIELD_ORDER,
  TICKET_TEMPLATE_PRESET_LABELS,
  applyTicketTemplatePreset,
  detectTemplatePreset,
} from '../../../shared/ticketTemplate'
import { Toggle } from '../ui/Toggle'
import { SettingsSection } from './SettingsSection'

const PRESET_OPTIONS: Exclude<TicketTemplatePreset, 'custom'>[] = [
  'full',
  'standard',
  'minimal',
]

export function TicketTemplateSection() {
  const { settings, updateTicketTemplate } = useAppSettings()
  const { ticketTemplate } = settings

  const handlePresetChange = (preset: Exclude<TicketTemplatePreset, 'custom'>) => {
    updateTicketTemplate(applyTicketTemplatePreset(preset))
  }

  const handleFieldToggle = (field: TicketTemplateFieldKey, enabled: boolean) => {
    const nextFields = { ...ticketTemplate.fields, [field]: enabled }
    if (field === 'issueSummary') {
      nextFields.issueSummary = true
    }
    updateTicketTemplate({
      fields: nextFields,
      preset: detectTemplatePreset(nextFields),
    })
  }

  return (
    <>
      <SettingsSection
        title="Template preset"
        description="Start from a preset, then fine-tune individual fields below."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {PRESET_OPTIONS.map((preset) => {
            const meta = TICKET_TEMPLATE_PRESET_LABELS[preset]
            const isActive = ticketTemplate.preset === preset
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={[
                  'rounded-xl border px-4 py-3 text-left transition-colors',
                  isActive
                    ? 'border-brand bg-brand/5 ring-1 ring-brand/30'
                    : 'border-border-strong bg-surface-elevated hover:border-brand/40',
                ].join(' ')}
              >
                <span className="block text-sm font-semibold text-text-primary">
                  {meta.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-text-muted">
                  {meta.description}
                </span>
              </button>
            )
          })}
        </div>
        {ticketTemplate.preset === 'custom' && (
          <p className="text-xs text-text-muted">
            Custom template — field toggles below do not match a preset.
          </p>
        )}
      </SettingsSection>

      <SettingsSection
        title="Included fields"
        description="Choose which sections appear in the ticket preview, wiki export, and Jira issue description."
      >
        <div className="space-y-4">
          {TICKET_TEMPLATE_FIELD_ORDER.map((field) => {
            const meta = TICKET_TEMPLATE_FIELD_META[field]
            return (
              <Toggle
                key={field}
                id={`template-field-${field}`}
                label={meta.label}
                description={meta.description}
                checked={ticketTemplate.fields[field]}
                disabled={meta.required}
                onChange={(checked) => handleFieldToggle(field, checked)}
              />
            )
          })}
        </div>
      </SettingsSection>
    </>
  )
}
