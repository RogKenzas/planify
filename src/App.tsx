import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { Content } from './components/content'
import LeftSideBar from './components/leftSideBar'
import AuthInterface from './pages/authInterface'

function App() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (
    <>
      <Navbar onOpen={() => setOpen(true)} />

      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<AuthInterface />} />
        <Route path="/register" element={<AuthInterface />} />
      </Routes>

      <LeftSideBar open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default App