import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ReducedMotionContextType {
  prefersReducedMotion: boolean
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  prefersReducedMotion: false,
})

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ReducedMotionContext.Provider value={{ prefersReducedMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  )
}

export function useReducedMotion() {
  const context = useContext(ReducedMotionContext)
  if (context === undefined) {
    throw new Error('useReducedMotion must be used within a ReducedMotionProvider')
  }
  return context.prefersReducedMotion
}

export function useAnimationConfig<T extends Record<string, any>>(
  config: T,
  reducedConfig?: Partial<T>
): T {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion && reducedConfig) {
    return { ...config, ...reducedConfig }
  }

  return config
}
