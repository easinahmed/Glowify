import { Navigate } from 'react-router-dom'

const parseJwt = (token) => {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch (error) {
    return null
  }
}

const ProtectedRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem('authToken')

  if (!token) {
    return <Navigate to="/auth/login" replace />
  }

  let user = null
  const storedUser = localStorage.getItem('authUser')
  if (storedUser) {
    try {
      user = JSON.parse(storedUser)
    } catch (error) {
      user = null
    }
  }

  if (!user) {
    const payload = parseJwt(token)
    user = payload ? { role: payload.role } : null
  }

  if (roles.length > 0 && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute