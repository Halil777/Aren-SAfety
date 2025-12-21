import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  const isVertical = orientation === 'vertical'
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-border',
        isVertical ? 'mx-2 h-full w-px' : 'my-2 h-px w-full',
        className,
      )}
      {...props}
    />
  )
}

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
}
