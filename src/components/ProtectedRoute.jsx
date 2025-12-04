import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useApp()
  const location = useLocation()

  if (!user) {
    // Redirect to login page, saving the current location
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

