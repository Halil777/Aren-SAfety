import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-muted text-foreground border border-border/60',
  outline: 'border border-border text-foreground',
  destructive: 'bg-destructive/10 text-destructive border border-destructive/30',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
