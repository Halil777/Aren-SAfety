import type { ObservationStatus } from '@/features/observations/types/observation'

export type DashboardCounts = {
  activeUsers: number
  openObservations: number
  supervisors: number
}

export type ObservationStatusCount = {
  status: ObservationStatus
  count: number
}

export type MonthlyActivityPoint = {
  month: string
  observations: number
  tasks: number
}

export type DashboardStats = {
  counts: DashboardCounts
  observationStatus: ObservationStatusCount[]
  monthlyActivity: MonthlyActivityPoint[]
}
