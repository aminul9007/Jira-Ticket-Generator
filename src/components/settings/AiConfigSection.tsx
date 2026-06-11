import { PROJECT_CONTEXT_PLACEHOLDER } from '../../data/defaultAppSettings'
import { useAppSettings } from '../../hooks/useAppSettings'
import { Textarea } from '../ui/Textarea'
import { Toggle } from '../ui/Toggle'
import { SettingsField } from './SettingsField'

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
