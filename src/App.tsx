import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { Content } from './components/content'
import LeftSideBar from './components/leftSideBar'
import AuthInterface from './pages/authInterface'
import DashInterface from './pages/dashboardInterface'

function App() {
  const [open, setOpen] = useState(false)
  const hideNavbar = location.pathname === "/dashboard"

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (
    <>
      {!hideNavbar && <Navbar onOpen={() => setOpen(true)} />}
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<AuthInterface />} />
        <Route path="/register" element={<AuthInterface />} />
        <Route path="/dashboard" element={<DashInterface />} />
      </Routes>

      {!hideNavbar && (<LeftSideBar open={open} onClose={() => setOpen(false)} />)}
    </>
  )
}

export default App