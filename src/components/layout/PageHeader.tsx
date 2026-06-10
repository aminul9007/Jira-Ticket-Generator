interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 lg:mb-10">
      <p className="type-eyebrow mb-2.5">Workspace</p>
      <h2 className="type-page-title text-balance">{title}</h2>
      <p className="type-page-desc mt-3">{description}</p>
    </div>
  )
}
