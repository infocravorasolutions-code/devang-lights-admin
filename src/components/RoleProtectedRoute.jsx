import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useApp()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user doesn't have access
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleProtectedRoute

