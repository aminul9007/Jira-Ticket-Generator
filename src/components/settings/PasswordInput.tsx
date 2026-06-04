import { useState } from 'react'
import { cn } from '../../utils/cn'
import { Input } from '../ui/Input'

interface PasswordInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoComplete?: string
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = 'off',
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="pr-20"
      />
      <button
        type="button"
        className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-text-muted',
          'hover:bg-hover-surface hover:text-text-primary',
        )}
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
      >
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
