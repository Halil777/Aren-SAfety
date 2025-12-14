import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats } from './dashboard'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000,
  })
}
