import { ClipboardList, ShieldCheck, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { PageHeader } from '@/shared/ui/page-header'
import { useDashboardStats } from '../api/use-dashboard-stats'
import type { MonthlyActivityPoint } from '../types'

function formatMonthLabel(value: string): string {
  const [yearStr, monthStr] = value.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  if (!Number.isNaN(year) && !Number.isNaN(month) && months[month - 1]) {
    return `${months[month - 1]} ${String(year).slice(2)}`
  }

  return value
}

function ActivityBars({
  data,
  maxValue,
  emptyLabel,
}: {
  data: MonthlyActivityPoint[]
  maxValue: number
  emptyLabel: string
}) {
  if (!data.length) {
    return (
      <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="flex h-56 items-end gap-3 overflow-x-auto pb-2">
      {data.map(item => {
        const total = item.observations + item.tasks
        const obsHeight = Math.round((item.observations / maxValue) * 100)
        const taskHeight = Math.round((item.tasks / maxValue) * 100)

        return (
          <div
            key={item.month}
            className="flex min-w-[72px] flex-1 flex-col items-center gap-2 rounded-lg bg-muted/30 p-2 shadow-inner"
          >
            <div className="flex h-full w-full flex-1 items-end gap-1 rounded-md bg-background p-2">
              <div
                style={{ height: `${obsHeight}%` }}
                className="flex-1 rounded-sm bg-amber-500/80"
              />
              <div
                style={{ height: `${taskHeight}%` }}
                className="flex-1 rounded-sm bg-emerald-500/80"
              />
            </div>
            <p className="text-xs font-semibold text-foreground">{total}</p>
            <p className="text-[11px] text-muted-foreground">{formatMonthLabel(item.month)}</p>
          </div>
        )
      })}
    </div>
  )
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useDashboardStats()

  const closedCount =
    data?.observationStatus.find(item => item.status === 'CLOSED')?.count ?? 0
  const activity = data?.monthlyActivity ?? []
  const maxActivity =
    activity.length > 0
      ? Math.max(...activity.map(item => item.observations + item.tasks)) || 1
      : 1

  const metrics =
    data?.counts
      ? [
          {
            label: t('dashboard.activeUsers'),
            value: data.counts.activeUsers.toLocaleString(),
            helper: t('dashboard.activeUsersHelper', { supervisors: data.counts.supervisors }),
            icon: Users,
          },
          {
            label: t('dashboard.openObservations'),
            value: data.counts.openObservations.toLocaleString(),
            helper: t('dashboard.closedObservationsHelper', { count: closedCount }),
            icon: ClipboardList,
          },
          {
            label: t('dashboard.supervisors'),
            value: data.counts.supervisors.toLocaleString(),
            helper: t('dashboard.supervisorsHelper'),
            icon: ShieldCheck,
          },
        ]
      : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('pages.dashboard.title')}
          description={t('pages.dashboard.description')}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(item => (
            <Card key={item} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded bg-muted/50" />
                  <div className="h-7 w-20 rounded bg-muted/40" />
                </div>
                <div className="h-10 w-10 rounded-full bg-muted/40" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-28 rounded bg-muted/40" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.tenantActivity')}</CardTitle>
            <CardDescription>{t('dashboard.tenantActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              {t('common.loading', { defaultValue: 'Loading...' })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t('pages.dashboard.title')}
          description={t('pages.dashboard.description')}
        />
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('common.noData', { defaultValue: 'No data available.' })}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pages.dashboard.title')}
        description={t('pages.dashboard.description')}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(metric => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold text-foreground">
                  {metric.value}
                </CardTitle>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <metric.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{metric.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.tenantActivity')}</CardTitle>
          <CardDescription>{t('dashboard.tenantActivityDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActivityBars
            data={activity}
            maxValue={maxActivity}
            emptyLabel={t('dashboard.emptyState')}
          />
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {t('dashboard.legendObservations')}
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t('dashboard.legendTasks')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
