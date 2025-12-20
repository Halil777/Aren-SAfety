import { type HTMLMotionProps, motion } from 'framer-motion'

export interface SlideUpProps extends HTMLMotionProps<'div'> {
  delay?: number
  duration?: number
  distance?: number
}

export function SlideUp({
  children,
  delay = 0,
  duration = 0.4,
  distance = 20,
  ...props
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ y: distance, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: distance, opacity: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
