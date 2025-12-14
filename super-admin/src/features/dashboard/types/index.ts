export interface Statistics {
  total: number
  active: number
  suspended: number
  growthData: GrowthDataPoint[]
  statusData: StatusDataPoint[]
}

export interface GrowthDataPoint {
  month: string
  count: number
}

export interface StatusDataPoint {
  month: string
  status: TenantStatus
  count: number
}

export type TenantStatus = 'active' | 'trial' | 'suspended' | 'disabled'
