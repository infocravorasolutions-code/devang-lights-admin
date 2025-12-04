import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { LogIn, Mail, Lock } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useApp()

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get the path the user was trying to access, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  // Demo users - In production, this would come from your backend
  const demoUsers = [
    {
      id: 1,
      email: 'admin@devanglights.com',
      password: 'admin123', // In production, passwords should be hashed
      name: 'Admin User',
      role: 'admin'
    },
    {
      id: 2,
      email: 'manager@devanglights.com',
      password: 'manager123',
      name: 'Manager One',
      role: 'manager'
    },
    {
      id: 3,
      email: 'staff@devanglights.com',
      password: 'staff123',
      name: 'Staff Member',
      role: 'staff'
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password')
      setLoading(false)
      return
    }

    // Simulate login API call
    // In a real app, this would be an actual API call to your backend
    setTimeout(() => {
      // Find user by email
      const user = demoUsers.find(
        u => u.email.toLowerCase() === formData.email.toLowerCase()
      )

      // Check if user exists and password matches
      if (user && user.password === formData.password) {
        login({
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email
        })
        // Redirect to the page they were trying to access, or dashboard
        navigate(from, { replace: true })
      } else {
        setError('Invalid email or password')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
            Devang Lights
          </h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <LogIn className="text-primary-600" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Sign In
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="admin@devanglights.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
            <p className="text-xs font-medium text-gray-700 text-center mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Admin:</span>
                <span>admin@devanglights.com / admin123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Manager:</span>
                <span>manager@devanglights.com / manager123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Staff:</span>
                <span>staff@devanglights.com / staff123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

