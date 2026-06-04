import type { ReactNode } from 'react'
import { Label } from '../ui/Label'

interface SettingsFieldProps {
  id?: string
  label: string
  hint?: string
  children: ReactNode
}

export function SettingsField({ id, label, hint, children }: SettingsFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      {children}
    </div>
  )
}
