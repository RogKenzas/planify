import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Content } from './components/content'
import LeftSideBar from './components/leftSideBar'
import AuthInterface from './pages/authInterface'
import DashInterface from './pages/dashboardInterface'
import EmptyPage from './pages/emptyPage'
import { AuthSessionProvider, useAuthSession } from './context/authSession'

function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, authChecked } = useAuthSession()
  if (!authChecked) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppShell() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const hideNavbar = location.pathname === '/dashboard'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  return (
    <>
      {!hideNavbar && <Navbar onOpen={() => setOpen(true)} />}
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<AuthInterface />} />
        <Route path="/register" element={<AuthInterface />} />
        <Route
          path="/services"
          element={<EmptyPage title="Services" subtitle="Les services Planify seront présentés ici." />}
        />
        <Route
          path="/schedule"
          element={<EmptyPage title="Planning" subtitle="Une vue planning dédiée arrivera dans cette page." />}
        />
        <Route
          path="/about"
          element={<EmptyPage title="À propos" subtitle="Cette page présentera bientôt Planify." />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <DashInterface />
            </ProtectedPage>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedPage>
              <EmptyPage title="Profil" subtitle="Votre profil sera configurable ici." />
            </ProtectedPage>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedPage>
              <EmptyPage title="Paramètres" subtitle="Les réglages de l'application seront disponibles ici." />
            </ProtectedPage>
          }
        />
      </Routes>

      {!hideNavbar && <LeftSideBar open={open} onClose={() => setOpen(false)} />}
    </>
  )
}

function App() {
  return (
    <AuthSessionProvider>
      <AppShell />
    </AuthSessionProvider>
  )
}

export default App
