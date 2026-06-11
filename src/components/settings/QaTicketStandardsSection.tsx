import { CUSTOM_QA_RULES_PLACEHOLDER } from '../../data/defaultAppSettings'
import { useAppSettings } from '../../hooks/useAppSettings'
import type {
  AiOutputStyle,
  QaStandardRuleKey,
  QaStandardsPreset,
} from '../../types/appSettings'
import {
  QA_OUTPUT_STYLE_LABELS,
  QA_STANDARDS_PRESET_OUTPUT_STYLE,
  QA_STANDARDS_PRESET_RULES,
  QA_STANDARD_RULE_META,
  QA_STANDARD_RULE_ORDER,
  QA_STANDARDS_PRESET_LABELS,
  applyQaStandardsPreset,
  createDefaultQaTicketStandards,
  detectPresetFromRules,
  formatQaStandardsPreview,
  getOutputStyleForQaStandardsPreset,
  resolveEffectiveOutputStyle,
} from '../../../shared/qaTicketStandards'
import { Button } from '../ui/Button'
import { Collapsible } from '../ui/Collapsible'
import { Textarea } from '../ui/Textarea'
import { Toggle } from '../ui/Toggle'
import { SettingsField } from './SettingsField'
import { SettingsSection } from './SettingsSection'
import { SettingsSelect } from './SettingsSelect'

const PRESET_OPTIONS: Exclude<QaStandardsPreset, 'custom'>[] = [
  'standard',
  'enterprise',
  'agile',
]

export function QaTicketStandardsSection() {
  const { settings, updateAi, updateQaTicketStandards } = useAppSettings()
  const { qaTicketStandards, ai } = settings

  const enabledCount = QA_STANDARD_RULE_ORDER.filter(
    (key) => qaTicketStandards.rules[key],
  ).length

  const effectiveOutputStyle = resolveEffectiveOutputStyle(
    qaTicketStandards.preset,
    ai.outputStyle,
  )

  const syncOutputStyleForPreset = (preset: QaStandardsPreset) => {
    const mapped = getOutputStyleForQaStandardsPreset(preset)
    if (mapped) {
      updateAi({ outputStyle: mapped })
    }
  }

  const handlePresetChange = (preset: Exclude<QaStandardsPreset, 'custom'>) => {
    updateQaTicketStandards(
      applyQaStandardsPreset(preset, qaTicketStandards.customRules),
    )
    syncOutputStyleForPreset(preset)
  }

  const handleRuleToggle = (rule: QaStandardRuleKey, enabled: boolean) => {
    const nextRules = { ...qaTicketStandards.rules, [rule]: enabled }
    updateQaTicketStandards({
      rules: nextRules,
      preset: detectPresetFromRules(nextRules),
    })
  }

  const handleReset = () => {
    updateQaTicketStandards(createDefaultQaTicketStandards())
    updateAi({ outputStyle: 'standard' })
  }

  const activePresetLabel =
    qaTicketStandards.preset === 'custom'
      ? 'Custom'
      : QA_STANDARDS_PRESET_LABELS[qaTicketStandards.preset].label

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-subtle/40 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-primary">Active preset</p>
          <p className="text-xs text-text-muted">
            {activePresetLabel} · {enabledCount} of {QA_STANDARD_RULE_ORDER.length} rules
            enabled · {QA_OUTPUT_STYLE_LABELS[effectiveOutputStyle]} generation
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset to defaults
        </Button>
      </div>

      <SettingsSection
        title="Standards preset"
        description="Each preset sets QA rules and generation verbosity (concise, standard, or detailed)."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {PRESET_OPTIONS.map((preset) => {
            const meta = QA_STANDARDS_PRESET_LABELS[preset]
            const style = QA_OUTPUT_STYLE_LABELS[QA_STANDARDS_PRESET_OUTPUT_STYLE[preset]]
            const ruleCount = QA_STANDARD_RULE_ORDER.filter(
              (key) => QA_STANDARDS_PRESET_RULES[preset][key],
            ).length
            const isActive = qaTicketStandards.preset === preset
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
                <span className="mt-2 inline-block rounded-md bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                  {style} · {ruleCount} rules
                </span>
              </button>
            )
          })}
        </div>
        {qaTicketStandards.preset === 'custom' && (
          <p className="text-xs text-text-muted">
            Custom configuration — rule toggles differ from preset defaults. Choose generation
            style below.
          </p>
        )}
      </SettingsSection>

      {qaTicketStandards.preset === 'custom' && (
        <SettingsSelect
          fieldId="custom-generation-style"
          label="Generation style"
          hint="Controls summary length, step count, and reasoning verbosity for custom configurations."
          value={ai.outputStyle}
          onChange={(e) => updateAi({ outputStyle: e.target.value as AiOutputStyle })}
        >
          <option value="concise">Concise — brief summaries, 3–4 steps</option>
          <option value="standard">Standard — balanced for triage</option>
          <option value="detailed">Detailed — thorough steps and reasoning</option>
        </SettingsSelect>
      )}

      <SettingsSection
        title="Enabled rules"
        description="Industry-standard QA rules injected into every AI-generated ticket. Standards take priority over custom rules."
      >
        <div className="space-y-4">
          {QA_STANDARD_RULE_ORDER.map((rule) => {
            const meta = QA_STANDARD_RULE_META[rule]
            return (
              <Toggle
                key={rule}
                id={`qa-standard-${rule}`}
                label={meta.label}
                description={meta.description}
                checked={qaTicketStandards.rules[rule]}
                onChange={(checked) => handleRuleToggle(rule, checked)}
              />
            )
          })}
        </div>
      </SettingsSection>

      <SettingsField
        id="custom-qa-rules"
        label="Custom project rules"
        hint="Optional rules appended after QA standards — e.g. module naming, company severity definitions."
      >
        <Textarea
          id="custom-qa-rules"
          rows={8}
          value={qaTicketStandards.customRules}
          placeholder={CUSTOM_QA_RULES_PLACEHOLDER}
          onChange={(e) => updateQaTicketStandards({ customRules: e.target.value })}
          className="min-h-[160px] font-mono text-sm leading-relaxed"
        />
      </SettingsField>

      <Collapsible title="Preview active standards" defaultOpen={false}>
        <pre className="max-h-64 overflow-auto rounded-lg bg-code-bg p-3 text-xs leading-relaxed text-code-text whitespace-pre-wrap">
          {formatQaStandardsPreview(qaTicketStandards)}
        </pre>
      </Collapsible>
    </>
  )
}
