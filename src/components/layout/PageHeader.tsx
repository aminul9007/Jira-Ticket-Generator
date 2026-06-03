interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 lg:mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand">
        Workspace
      </p>
      <h2 className="text-balance text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-text-secondary">
        {description}
      </p>
    </div>
  )
}
