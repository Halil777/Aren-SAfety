import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  HTMLAttributes,
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  RefObject,
  MouseEvent as ReactMouseEvent,
} from 'react'
import { cn } from '@/shared/lib/cn'

type Align = 'start' | 'center' | 'end'
type DocMouseEvent = globalThis.MouseEvent

type DropdownContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLElement | null>
}

const DropdownMenuContext = createContext<DropdownContextValue | null>(null)

export function DropdownMenu({ children }: PropsWithChildren) {
  const triggerRef = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  const value = useMemo(() => ({ open, setOpen, triggerRef }), [open])

  return (
    <DropdownMenuContext.Provider value={value}>
      <div className="relative inline-flex">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

type DropdownMenuTriggerProps = {
  children: ReactElement
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, asChild = false }: DropdownMenuTriggerProps) {
  const ctx = useDropdownContext()

  if (asChild && isValidElement(children)) {
    const element = children as ReactElement<any>
    const childProps = element.props as any
    return cloneElement(element, {
      ref: ctx.triggerRef as any,
      onClick: (e: ReactMouseEvent) => {
        childProps?.onClick?.(e)
        ctx.setOpen(!ctx.open)
      },
      'aria-haspopup': 'menu',
      'aria-expanded': ctx.open,
    } as any)
  }

  return (
    <button
      ref={ctx.triggerRef as any}
      type="button"
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      onClick={() => ctx.setOpen(!ctx.open)}
      className="inline-flex items-center justify-center"
    >
      {children}
    </button>
  )
}

type DropdownMenuContentProps = HTMLAttributes<HTMLDivElement> & {
  align?: Align
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent({ className, align = 'start', children, style, ...props }, ref) {
    const ctx = useDropdownContext()
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!ctx.open) return
      const onClick = (e: DocMouseEvent) => {
        const target = e.target as Node
        if (!contentRef.current || !ctx.triggerRef.current) return
        if (
          !contentRef.current.contains(target) &&
          !ctx.triggerRef.current.contains(target as Node)
        ) {
          ctx.setOpen(false)
        }
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') ctx.setOpen(false)
      }
      document.addEventListener('mousedown', onClick)
      document.addEventListener('keydown', onKey)
      return () => {
        document.removeEventListener('mousedown', onClick)
        document.removeEventListener('keydown', onKey)
      }
    }, [ctx])

    if (!ctx.open) return null

    const alignClass =
      align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'

    return (
      <div
        ref={node => {
          contentRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = node
        }}
        role="menu"
        style={style}
        className={cn(
          'absolute z-50 mt-2 min-w-[12rem] origin-top overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-popover/80',
          'focus-visible:outline-none',
          alignClass,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

type DropdownMenuItemProps = HTMLAttributes<HTMLDivElement> & {
  inset?: boolean
  disabled?: boolean
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, children, inset, disabled, onClick, ...props }, ref) {
    const ctx = useDropdownContext()

    const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(e)
      ctx.setOpen(false)
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={handleClick}
        className={cn(
          'flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-foreground transition-colors',
          'hover:bg-muted focus:bg-muted focus:outline-none',
          disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
          inset && 'pl-9',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

export function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground', className)}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('my-1 h-px bg-border/80', className)} role="separator" {...props} />
  )
}

function useDropdownContext() {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) throw new Error('DropdownMenu components must be used within <DropdownMenu>')
  return ctx
}
