import { type HTMLMotionProps, motion } from 'framer-motion'

export interface ScaleInProps extends HTMLMotionProps<'div'> {
  delay?: number
  duration?: number
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  ...props
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
