import { useApp } from '../context/AppContext'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'

const Reports = () => {
  const { products, getTotalStockValue, purchaseOrders } = useApp()

  const totalStockValue = getTotalStockValue()
  const totalProducts = products.length
  const lowStockCount = products.filter(p => p.stock < 20).length
  const totalPOValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0)

  // Calculate fast/slow moving (simplified logic)
  const fastMoving = products.filter(p => p.stock < 30).length
  const slowMoving = products.filter(p => p.stock > 100).length

  const categoryBreakdown = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  const reports = [
    {
      title: 'Stock Valuation Report',
      icon: DollarSign,
      value: `₹${(totalStockValue / 100000).toFixed(2)}L`,
      description: 'Total inventory value',
      color: 'text-green-600'
    },
    {
      title: 'Total SKUs',
      icon: Package,
      value: totalProducts,
      description: 'Products in catalog',
      color: 'text-blue-600'
    },
    {
      title: 'Low Stock Items',
      icon: TrendingDown,
      value: lowStockCount,
      description: 'Items requiring restock',
      color: 'text-red-600'
    },
    {
      title: 'Purchase Orders Value',
      icon: BarChart3,
      value: `₹${(totalPOValue / 100000).toFixed(2)}L`,
      description: 'Total PO value',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reports.map((report, index) => {
          const Icon = report.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between mb-4">
                <Icon className={report.color} size={24} />
              </div>
              <h3 className="text-sm text-gray-500 mb-1">{report.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{report.value}</p>
              <p className="text-xs text-gray-500">{report.description}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown).map(([category, count]) => {
              const percentage = ((count / totalProducts) * 100).toFixed(1)
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="text-gray-500">{count} items ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fast/Slow Moving */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Movement Analysis</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <span className="font-medium text-gray-700">Fast Moving</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{fastMoving}</span>
              </div>
              <p className="text-sm text-gray-500">Items with low stock (high demand)</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="text-red-600" size={20} />
                  <span className="font-medium text-gray-700">Slow Moving</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{slowMoving}</span>
              </div>
              <p className="text-sm text-gray-500">Items with high stock (low demand)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Movement Report */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement Report</h2>
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">Product</th>
                <th className="table-header">SKU</th>
                <th className="table-header">Current Stock</th>
                <th className="table-header">Category</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.slice(0, 10).map((product) => {
                const status = product.stock < 20 ? 'Low' : product.stock < 50 ? 'Medium' : 'Good'
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{product.name}</td>
                    <td className="table-cell">{product.sku}</td>
                    <td className="table-cell">{product.stock}</td>
                    <td className="table-cell">{product.category}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        status === 'Low' ? 'bg-red-100 text-red-800' :
                        status === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {products.slice(0, 10).map((product) => {
            const status = product.stock < 20 ? 'Low' : product.stock < 50 ? 'Medium' : 'Good'
            return (
              <div key={product.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                    status === 'Low' ? 'bg-red-100 text-red-800' :
                    status === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className="text-sm font-semibold text-gray-900">{product.stock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-900">{product.category}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Reports

