import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useProfileQuery } from '@/features/auth/api/hooks'
import { TenantLayout } from '@/app/layout/tenant-layout'
import { useAuthStore } from '@/shared/store/auth-store'

export function ProtectedLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const tenant = useAuthStore((state) => state.tenant)
  const logout = useAuthStore((state) => state.logout)
  const role = tenant?.role ?? 'ADMIN'

  const profileQuery = useProfileQuery(Boolean(token))

  useEffect(() => {
    if (profileQuery.data && profileQuery.data.status !== 'active') {
      const targetState = {
        tenantEmail: profileQuery.data.email,
        tenantId: profileQuery.data.id,
      }
      logout()
      navigate('/support', { replace: true, state: targetState })
    }
  }, [logout, navigate, profileQuery.data])

  const isActiveOrTrial = tenant?.status === 'active' || tenant?.status === 'trial'
  const isSupervisor = role === 'SUPERVISOR'
  const allowedForSupervisor = ['/', '/observations', '/tasks']

  if (!token || !tenant) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isActiveOrTrial) {
    logout()
    return <Navigate to="/support" replace />
  }

  if (profileQuery.isError) {
    return <Navigate to="/login" replace />
  }

  if (isSupervisor) {
    const inAllowed = allowedForSupervisor.some(path =>
      location.pathname === path || location.pathname.startsWith(`${path}/`),
    )
    if (!inAllowed) {
      return <Navigate to="/" replace />
    }
  }

  return (
    <TenantLayout>
      <Outlet />
    </TenantLayout>
  )
}
