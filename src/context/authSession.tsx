import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentSession, logoutUser, type AuthUser } from '../api/auth'
import LogoutConfirmModal from '../components/logoutConfirmModal'

type AuthSessionValue = {
  user: AuthUser | null
  authChecked: boolean
  requestLogout: () => void
}

const AuthSessionContext = createContext<AuthSessionValue | null>(null)

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)

  useEffect(() => {
    getCurrentSession()
      .then((sessionUser) => setUser(sessionUser))
      .catch(() => setUser(null))
      .finally(() => setAuthChecked(true))
  }, [location.pathname])

  const requestLogout = useCallback(() => {
    setLogoutOpen(true)
  }, [])

  const confirmLogout = async () => {
    await logoutUser()
    setUser(null)
    setLogoutOpen(false)
    navigate('/', { replace: true })
  }

  const value = useMemo(
    () => ({ user, authChecked, requestLogout }),
    [user, authChecked, requestLogout]
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
      <LogoutConfirmModal
        open={logoutOpen}
        username={user?.username ?? 'utilisateur'}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </AuthSessionContext.Provider>
  )
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext)
  if (!context) {
    throw new Error('useAuthSession doit être utilisé dans AuthSessionProvider')
  }
  return context
}
