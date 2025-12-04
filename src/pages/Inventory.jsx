import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Package, Plus, ArrowRightLeft, Search, Filter } from 'lucide-react'

const Inventory = () => {
  const { products, warehouses, updateStock, user } = useApp()
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const canManageStock = isAdmin || isManager
  const canTransfer = isAdmin // Only admin can transfer stock between warehouses
  const [selectedWarehouse, setSelectedWarehouse] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddStockModal, setShowAddStockModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [stockForm, setStockForm] = useState({ quantity: '', warehouse: '' })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesWarehouse = selectedWarehouse === 'all' || product.warehouse === selectedWarehouse
    return matchesSearch && matchesWarehouse
  })

  const warehouseStock = warehouses.map(warehouse => {
    const productsInWarehouse = products.filter(p => p.warehouse === warehouse.name)
    const totalStock = productsInWarehouse.reduce((sum, p) => sum + p.stock, 0)
    const totalValue = productsInWarehouse.reduce((sum, p) => sum + (p.stock * p.cost), 0)
    return {
      ...warehouse,
      totalStock,
      totalValue,
      productCount: productsInWarehouse.length
    }
  })

  const handleAddStock = (e) => {
    e.preventDefault()
    if (selectedProduct && stockForm.quantity) {
      updateStock(selectedProduct.id, 1, parseInt(stockForm.quantity), 'add')
      setShowAddStockModal(false)
      setStockForm({ quantity: '', warehouse: '' })
      setSelectedProduct(null)
    }
  }

  const handleTransfer = (e) => {
    e.preventDefault()
    // Transfer logic would go here
    setShowTransferModal(false)
    setStockForm({ quantity: '', warehouse: '' })
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory & Warehouse</h1>
        <div className="flex flex-wrap gap-2">
          {canTransfer && (
            <button
              onClick={() => setShowTransferModal(true)}
              className="btn-secondary flex items-center space-x-2 text-sm sm:text-base"
            >
              <ArrowRightLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Transfer Stock</span>
              <span className="sm:hidden">Transfer</span>
            </button>
          )}
          {canManageStock && (
            <button
              onClick={() => setShowAddStockModal(true)}
              className="btn-primary flex items-center space-x-2 text-sm sm:text-base"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Add Stock</span>
            </button>
          )}
        </div>
      </div>

      {/* Warehouse Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouseStock.map((warehouse) => (
          <div key={warehouse.id} className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{warehouse.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{warehouse.location}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Products:</span>
                <span className="font-medium">{warehouse.productCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Stock:</span>
                <span className="font-medium">{warehouse.totalStock} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Value:</span>
                <span className="font-medium">₹{(warehouse.totalValue / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="input-field"
            >
              <option value="all">All Warehouses</option>
              {warehouses.map(wh => (
                <option key={wh.id} value={wh.name}>{wh.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table - Desktop */}
      <div className="hidden lg:block card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">SKU</th>
                <th className="table-header">Product Name</th>
                <th className="table-header">Warehouse</th>
                <th className="table-header">Current Stock</th>
                <th className="table-header">Unit Cost</th>
                <th className="table-header">Stock Value</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const stockValue = product.stock * product.cost
                const status = product.stock < 20 ? 'Low' : product.stock < 50 ? 'Medium' : 'Good'
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{product.sku}</td>
                    <td className="table-cell">{product.name}</td>
                    <td className="table-cell">{product.warehouse}</td>
                    <td className="table-cell font-medium">{product.stock}</td>
                    <td className="table-cell">₹{product.cost.toLocaleString()}</td>
                    <td className="table-cell">₹{stockValue.toLocaleString()}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        status === 'Low' ? 'bg-red-100 text-red-800' :
                        status === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="table-cell">
                      {canManageStock ? (
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setStockForm({ quantity: '', warehouse: product.warehouse })
                            setShowAddStockModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Adjust
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">View Only</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.map((product) => {
          const stockValue = product.stock * product.cost
          const status = product.stock < 20 ? 'Low' : product.stock < 50 ? 'Medium' : 'Good'
          return (
            <div key={product.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                </div>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  status === 'Low' ? 'bg-red-100 text-red-800' :
                  status === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Warehouse</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{product.warehouse}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Stock</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{product.stock} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Unit Cost</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">₹{product.cost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Stock Value</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">₹{stockValue.toLocaleString()}</p>
                </div>
              </div>
              {canManageStock && (
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setStockForm({ quantity: '', warehouse: product.warehouse })
                      setShowAddStockModal(true)
                    }}
                    className="w-full btn-primary text-sm"
                  >
                    Adjust Stock
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Stock Modal */}
      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Add/Adjust Stock</h2>
              {selectedProduct && (
                <p className="text-sm text-gray-500 mt-1">{selectedProduct.name} ({selectedProduct.sku})</p>
              )}
            </div>
            <form onSubmit={handleAddStock} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                <select
                  value={stockForm.warehouse}
                  onChange={(e) => setStockForm({ ...stockForm, warehouse: e.target.value })}
                  className="input-field"
                  required
                >
                  {warehouses.map(wh => (
                    <option key={wh.id} value={wh.name}>{wh.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={stockForm.quantity}
                  onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
                  className="input-field"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStockModal(false)
                    setSelectedProduct(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory

