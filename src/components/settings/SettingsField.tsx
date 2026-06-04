import type { ReactNode } from 'react'
import { Label } from '../ui/Label'

interface SettingsFieldProps {
  id?: string
  label: string
  hint?: string
  children: ReactNode
}

export function SettingsField({ id, label, hint, children }: SettingsFieldProps) {
  const labelId = id ? `${id}-label` : undefined
  const hintId = id && hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-2">
      <Label htmlFor={id} id={labelId} hint={hint} hintId={hintId}>
        {label}
      </Label>
      {children}
    </div>
  )
}
