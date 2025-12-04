import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  Image, 
  BarChart3, 
  Users, 
  FileText,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    // Close sidebar on mobile
    setSidebarOpen(false)
    // Redirect to login page
    navigate('/login', { replace: true })
  }

  // Define menu items with role-based access
  const allMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'staff'] },
    { path: '/products', icon: Package, label: 'Products', roles: ['admin', 'manager', 'staff'] },
    { path: '/inventory', icon: Warehouse, label: 'Inventory', roles: ['admin', 'manager', 'staff'] },
    { path: '/purchase-orders', icon: ShoppingCart, label: 'Purchase Orders', roles: ['admin', 'manager', 'staff'] },
    { path: '/media', icon: Image, label: 'Media Library', roles: ['admin', 'manager'] },
    { path: '/reports', icon: BarChart3, label: 'Reports', roles: ['admin', 'manager', 'staff'] },
    { path: '/users', icon: Users, label: 'Users', roles: ['admin'] }, // Admin only
    { path: '/activity-log', icon: FileText, label: 'Activity Log', roles: ['admin', 'manager'] },
  ]

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    user && item.roles.includes(user.role)
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-lg sm:text-xl font-bold text-primary-600">Devang Lights</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        w-64 h-screen
        bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="h-16 px-4 sm:px-6 flex items-center border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-600">Devang Lights</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        {user && (
          <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

