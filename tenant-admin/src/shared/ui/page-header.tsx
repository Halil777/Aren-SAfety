import { type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type PageHeaderProps = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-b border-dashed border-border pb-4 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
        <h1 className="text-2xl font-semibold tracking-tight uppercase">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground max-w-3xl md:text-base">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}
