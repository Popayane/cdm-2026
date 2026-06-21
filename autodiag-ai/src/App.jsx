import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Vehicles from './pages/Vehicles'
import Diagnostic from './pages/Diagnostic'
import History from './pages/History'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/connexion" replace />
  return children
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicules" element={<Vehicles />} />
        <Route path="/diagnostic" element={<Diagnostic />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/historique" element={<Protected><History /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
