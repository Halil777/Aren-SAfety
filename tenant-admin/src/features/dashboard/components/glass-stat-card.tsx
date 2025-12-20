import { type LucideIcon } from 'lucide-react'
import { GlassCard } from '@/shared/ui/glass-card'
import { CountUp } from '@/shared/ui/animated-number'
import { SparklineChart } from './advanced-charts/sparkline-chart'
import { cn } from '@/shared/lib/cn'

export type StatTone = 'neutral' | 'info' | 'warn' | 'good'

export interface GlassStatCardProps {
  label: string
  value: number
  sub?: string
  icon: LucideIcon
  tone?: StatTone
  sparklineData?: number[]
  trend?: 'up' | 'down' | 'neutral'
  loading?: boolean
}

export function GlassStatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'neutral',
  sparklineData = [],
  trend = 'neutral',
  loading = false,
}: GlassStatCardProps) {
  const toneConfig = {
    neutral: {
      border: 'border-border/60',
      gradient: 'from-muted/40 via-muted/10 to-transparent',
      iconBg: 'bg-muted/20',
      iconColor: 'text-muted-foreground',
      sparkline: 'rgba(148, 163, 184, 1)',
      sparklineFill: 'rgba(148, 163, 184, 0.2)',
    },
    info: {
      border: 'border-primary/25',
      gradient: 'from-primary/12 via-primary/6 to-transparent',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      sparkline: 'rgba(139, 92, 246, 1)',
      sparklineFill: 'rgba(139, 92, 246, 0.2)',
    },
    warn: {
      border: 'border-amber-500/25',
      gradient: 'from-amber-500/12 via-amber-500/6 to-transparent',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      sparkline: 'rgba(245, 158, 11, 1)',
      sparklineFill: 'rgba(245, 158, 11, 0.2)',
    },
    good: {
      border: 'border-emerald-500/25',
      gradient: 'from-emerald-500/12 via-emerald-500/6 to-transparent',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      sparkline: 'rgba(16, 185, 129, 1)',
      sparklineFill: 'rgba(16, 185, 129, 0.2)',
    },
  }

  const config = toneConfig[tone]

  return (
    <GlassCard
      variant="medium"
      className={cn(
        'group relative overflow-hidden transition-all',
        config.border,
        'hover:scale-[1.02]'
      )}
    >
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          config.gradient
        )}
      />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <div className="text-3xl font-bold tracking-tight">
              {loading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-muted/50" />
              ) : (
                <CountUp value={value} duration={1.5} />
              )}
            </div>
          </div>

          {/* Icon */}
          <div
            className={cn(
              'rounded-2xl p-3 transition-all duration-300',
              'group-hover:scale-110 group-hover:rotate-6',
              config.iconBg
            )}
          >
            <Icon className={cn('h-6 w-6', config.iconColor)} />
          </div>
        </div>

        {/* Subtitle */}
        {sub && (
          <p className="mt-3 text-sm text-muted-foreground">{sub}</p>
        )}

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="mt-4">
            <SparklineChart
              data={sparklineData}
              width={200}
              height={40}
              color={config.sparkline}
              fillColor={config.sparklineFill}
              className="w-full"
            />
          </div>
        )}

        {/* Trend indicator */}
        {!loading && sparklineData.length > 0 && trend !== 'neutral' && (
          <div className="mt-2 flex items-center gap-1">
            <div
              className={cn(
                'flex items-center text-xs font-medium',
                trend === 'up' && 'text-emerald-600',
                trend === 'down' && 'text-rose-600'
              )}
            >
              {trend === 'up' ? '↑' : '↓'}
              <span className="ml-1">
                {trend === 'up' ? 'Trending up' : 'Trending down'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Shimmer loading effect */}
      {loading && (
        <div className="shimmer-wrapper absolute inset-0" />
      )}
    </GlassCard>
  )
}
