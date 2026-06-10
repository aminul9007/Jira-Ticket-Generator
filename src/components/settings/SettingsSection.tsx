import type { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="space-y-5 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="space-y-1.5">
        <h3 className="type-section-title">{title}</h3>
        {description && (
          <p className="type-section-desc">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  )
}
