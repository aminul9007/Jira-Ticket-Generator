import type { ReactNode } from 'react'
import { Card, CardHeader } from '../ui/Card'

interface SettingsPageCardProps {
  id: string
  title: string
  description: string
  icon?: ReactNode
  children: ReactNode
}

export function SettingsPageCard({
  id,
  title,
  description,
  icon,
  children,
}: SettingsPageCardProps) {
  return (
    <Card id={id} variant="elevated" className="scroll-mt-24">
      <CardHeader title={title} description={description} icon={icon} />
      <div className="space-y-6">{children}</div>
    </Card>
  )
}
