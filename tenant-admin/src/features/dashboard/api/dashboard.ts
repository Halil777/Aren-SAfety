import { ROUTES } from '@/shared/config/api'
import { apiClient } from '@/shared/lib/api-client'
import type { Observation, ObservationStatus } from '@/features/observations/types/observation'
import type { Task } from '@/features/tasks/types/task'
import type { Supervisor } from '@/features/supervisors/types/supervisor'
import type { DashboardStats } from '../types'

const MAX_MONTHS = 6

function toMonthKey(value?: string | null): string | null {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [observations, tasks, supervisors] = await Promise.all([
    apiClient.get<Observation[]>(ROUTES.OBSERVATIONS.LIST),
    apiClient.get<Task[]>(ROUTES.TASKS.LIST),
    apiClient.get<Supervisor[]>(ROUTES.SUPERVISORS.LIST),
  ])

  const activeUsers = supervisors.filter(user => user.isActive !== false).length || 0
  const openObservations = observations.filter(item => item.status !== 'CLOSED').length

  const statusMap = new Map<ObservationStatus, number>()
  observations.forEach(item => {
    statusMap.set(item.status, (statusMap.get(item.status) ?? 0) + 1)
  })

  const monthMap = new Map<string, { observations: number; tasks: number }>()

  observations.forEach(item => {
    const key = toMonthKey(item.createdAt)
    if (!key) return
    const current = monthMap.get(key) ?? { observations: 0, tasks: 0 }
    monthMap.set(key, { ...current, observations: current.observations + 1 })
  })

  tasks.forEach(item => {
    const key = toMonthKey(item.createdAt)
    if (!key) return
    const current = monthMap.get(key) ?? { observations: 0, tasks: 0 }
    monthMap.set(key, { ...current, tasks: current.tasks + 1 })
  })

  const monthlyActivity = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-MAX_MONTHS)
    .map(([month, counts]) => ({
      month,
      observations: counts.observations,
      tasks: counts.tasks,
    }))

  return {
    counts: {
      activeUsers,
      openObservations,
      supervisors: supervisors.filter(item => item.isActive !== false).length,
    },
    observationStatus: Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    })),
    monthlyActivity,
  }
}
