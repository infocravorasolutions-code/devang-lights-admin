import { useApp } from '../context/AppContext'
import { Package, AlertTriangle, DollarSign, Plus, ShoppingCart, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const Dashboard = () => {
  const { products, getLowStockItems, getTotalStockValue, purchaseOrders, activityLog, user } = useApp()
  
  const totalSKUs = products.length
  const lowStockItems = getLowStockItems()
  const stockValue = getTotalStockValue()
  const pendingPOs = purchaseOrders.filter(po => po.status === 'pending').length
  const recentActivities = activityLog.slice(0, 5)

  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const isStaff = user?.role === 'staff'
  const canAddProduct = isAdmin || isManager
  const canManageStock = isAdmin || isManager
  const canCreatePO = isAdmin || isManager

  const stats = [
    {
      title: 'Total SKUs',
      value: totalSKUs,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: lowStockItems.length > 0 ? 'Action Required' : 'All Good'
    },
    {
      title: 'Stock Valuation',
      value: `₹${(stockValue / 100000).toFixed(2)}L`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+5.2%'
    },
    {
      title: 'Pending POs',
      value: pendingPOs,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: 'Needs Attention'
    }
  ]

  const allQuickActions = [
    { label: 'Add Product', icon: Plus, path: '/products?action=add', color: 'bg-primary-600', allowed: canAddProduct },
    { label: 'Add Stock', icon: Package, path: '/inventory?action=add', color: 'bg-green-600', allowed: canManageStock },
    { label: 'Create PO', icon: ShoppingCart, path: '/purchase-orders?action=create', color: 'bg-purple-600', allowed: canCreatePO }
  ]

  const quickActions = allQuickActions.filter(action => action.allowed)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.path}
                className={`${action.color} text-white p-3 sm:p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center sm:justify-start space-x-3 text-sm sm:text-base`}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" />
                <span className="font-medium">{action.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="card">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          {lowStockItems.length > 0 ? (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{item.stock} units</p>
                    <p className="text-xs text-gray-500">Stock left</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">All items are well stocked!</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="mt-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(activity.timestamp, 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

