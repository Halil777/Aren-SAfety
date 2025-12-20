import { type HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export type GradientPreset = 'primary' | 'success' | 'warning' | 'info' | 'custom'

export interface AnimatedGradientProps extends HTMLAttributes<HTMLDivElement> {
  preset?: GradientPreset
  customGradient?: string
  speed?: 'slow' | 'normal' | 'fast'
  fullscreen?: boolean
}

const gradientPresets: Record<Exclude<GradientPreset, 'custom'>, string> = {
  primary: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
  success: 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400',
  warning: 'bg-gradient-to-br from-rose-400 via-pink-400 to-yellow-300',
  info: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-800',
}

const speedClasses = {
  slow: '[animation-duration:12s]',
  normal: '[animation-duration:8s]',
  fast: '[animation-duration:4s]',
}

export function AnimatedGradient({
  preset = 'primary',
  customGradient,
  speed = 'normal',
  fullscreen = false,
  className,
  ...props
}: AnimatedGradientProps) {
  const gradientClass = preset === 'custom' && customGradient
    ? customGradient
    : gradientPresets[preset as Exclude<GradientPreset, 'custom'>]

  return (
    <div
      className={cn(
        'gradient-animated',
        gradientClass,
        speedClasses[speed],
        fullscreen ? 'fixed inset-0 -z-10' : 'absolute inset-0',
        className
      )}
      {...props}
    />
  )
}

export interface GradientOrbProps extends HTMLAttributes<HTMLDivElement> {
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
}

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96',
}

const blurClasses = {
  sm: 'blur-sm',
  md: 'blur-md',
  lg: 'blur-lg',
  xl: 'blur-3xl',
}

export function GradientOrb({
  color = 'from-purple-500',
  size = 'lg',
  blur = 'xl',
  opacity = 0.3,
  className,
  style,
  ...props
}: GradientOrbProps) {
  return (
    <div
      className={cn(
        'absolute rounded-full bg-gradient-to-br to-transparent',
        color,
        sizeClasses[size],
        blurClasses[blur],
        'animate-float pointer-events-none',
        className
      )}
      style={{ opacity, ...style }}
      {...props}
    />
  )
}
