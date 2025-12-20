import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  format?: (value: number) => string
}

export function AnimatedNumber({
  value,
  duration = 1,
  className,
  format = (val) => Math.floor(val).toLocaleString(),
}: AnimatedNumberProps) {
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) => format(current))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className={className}>{display}</motion.span>
}

export interface CountUpProps {
  value: number
  duration?: number
  className?: string
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
}

export function CountUp({
  value,
  duration = 1,
  className,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
}: CountUpProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const previousValue = useRef(0)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const start = previousValue.current
    const end = value
    const range = end - start
    const startTime = Date.now()
    const durationMs = duration * 1000

    const step = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = start + range * easeOut

      const formatted = current.toFixed(decimals)
      const parts = formatted.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      node.textContent = prefix + parts.join('.') + suffix

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        previousValue.current = end
      }
    }

    requestAnimationFrame(step)
  }, [value, duration, decimals, prefix, suffix, separator])

  return <span ref={nodeRef} className={className}>
{prefix}0{suffix}</span>
}
