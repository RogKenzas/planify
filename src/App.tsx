import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { Content } from './components/content'
import Login from './pages/login'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App;