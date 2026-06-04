import { PROJECT_CONTEXT_PLACEHOLDER } from '../../data/defaultAppSettings'
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
        hint="Injected into AI prompts to improve ticket quality. Include environments, components, and severity rules."
      >
        <Textarea
          id="project-context"
          rows={14}
          value={ai.projectContext}
          placeholder={PROJECT_CONTEXT_PLACEHOLDER}
          onChange={(e) => updateAi({ projectContext: e.target.value })}
          className="min-h-[280px] font-mono text-sm leading-relaxed"
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
