import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RequireNonAdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Loading...</div>
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />
  }

  return children
}

export default RequireNonAdminRoute