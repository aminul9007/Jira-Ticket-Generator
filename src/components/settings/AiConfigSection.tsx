import {
  PROJECT_CONTEXT_PLACEHOLDER,
  TICKET_GUIDELINES_PLACEHOLDER,
} from '../../data/defaultAppSettings'
import { useAppSettings } from '../../hooks/useAppSettings'
import type { AiOutputStyle } from '../../types/appSettings'
import { Textarea } from '../ui/Textarea'
import { Toggle } from '../ui/Toggle'
import { SettingsField } from './SettingsField'
import { SettingsSelect } from './SettingsSelect'

export function AiConfigSection() {
  const { settings, updateAi } = useAppSettings()
  const { ai } = settings

  return (
    <>
      <SettingsField
        id="project-context"
        label="Project context / knowledge base"
        hint="Product facts: environments, components, modules, and severity rules for your project."
      >
        <Textarea
          id="project-context"
          rows={12}
          value={ai.projectContext}
          placeholder={PROJECT_CONTEXT_PLACEHOLDER}
          onChange={(e) => updateAi({ projectContext: e.target.value })}
          className="min-h-[240px] font-mono text-sm leading-relaxed"
        />
      </SettingsField>

      <SettingsField
        id="ticket-guidelines"
        label="Ticket writing guidelines"
        hint="Train how tickets should read — tone, naming, title style, and environment vocabulary. Applied to every AI-generated ticket."
      >
        <Textarea
          id="ticket-guidelines"
          rows={12}
          value={ai.ticketGuidelines}
          placeholder={TICKET_GUIDELINES_PLACEHOLDER}
          onChange={(e) => updateAi({ ticketGuidelines: e.target.value })}
          className="min-h-[220px] font-mono text-sm leading-relaxed"
        />
      </SettingsField>

      <SettingsSelect
        fieldId="ai-output-style"
        label="AI output style"
        hint="Controls how verbose AI-generated summaries and steps are."
        value={ai.outputStyle}
        onChange={(e) => updateAi({ outputStyle: e.target.value as AiOutputStyle })}
      >
        <option value="concise">Concise</option>
        <option value="standard">Standard</option>
        <option value="detailed">Detailed</option>
      </SettingsSelect>

      <Toggle
        id="auto-generate-voice"
        checked={ai.autoGenerateAfterVoice}
        onChange={(checked) => updateAi({ autoGenerateAfterVoice: checked })}
        label="Auto-generate after voice recording"
        description="When enabled, stops dictation and immediately generates a Jira ticket."
      />
    </>
  )
}
