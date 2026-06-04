import type { ReactNode, SelectHTMLAttributes } from 'react'
import { Label } from '../ui/Label'
import { Select } from '../ui/Select'

interface SettingsSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fieldId: string
  label: string
  hint?: string
}

export function SettingsSelect({
  fieldId,
  label,
  hint,
  children,
  ...selectProps
}: SettingsSelectProps) {
  const labelId = `${fieldId}-label`
  const hintId = hint ? `${fieldId}-hint` : undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} id={labelId} hint={hint} hintId={hintId}>
        {label}
      </Label>
      <Select
        id={fieldId}
        aria-label={label}
        title={label}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        {...selectProps}
      >
        {children as ReactNode}
      </Select>
    </div>
  )
}
