import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Search, Filter, Edit, Trash2, Upload, Download } from 'lucide-react'

const Products = () => {
  const { products, addProduct, updateProduct, user } = useApp()
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const canEdit = isAdmin || isManager
  const canDelete = isAdmin
  const canImportExport = isAdmin
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Lights',
    price: '',
    cost: '',
    stock: '',
    warehouse: 'Main Warehouse',
    specs: {}
  })

  const categories = ['all', 'Lights', 'Crafts', 'Décor']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProduct) {
      updateProduct(editingProduct.id, formData)
    } else {
      addProduct({
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock)
      })
    }
    setShowAddModal(false)
    setEditingProduct(null)
    setFormData({
      sku: '',
      name: '',
      category: 'Lights',
      price: '',
      cost: '',
      stock: '',
      warehouse: 'Main Warehouse',
      specs: {}
    })
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      warehouse: product.warehouse,
      specs: product.specs
    })
    setShowAddModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex flex-wrap gap-2">
          {canImportExport && (
            <>
              <button className="btn-secondary flex items-center space-x-2 text-sm sm:text-base">
                <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2 text-sm sm:text-base">
                <Download size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </>
          )}
          {canEdit && (
            <button 
              onClick={() => {
                setEditingProduct(null)
                setFormData({
                  sku: '',
                  name: '',
                  category: 'Lights',
                  price: '',
                  cost: '',
                  stock: '',
                  warehouse: 'Main Warehouse',
                  specs: {}
                })
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center space-x-2 text-sm sm:text-base"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden lg:block card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">SKU</th>
                <th className="table-header">Name</th>
                <th className="table-header">Category</th>
                <th className="table-header">Price</th>
                <th className="table-header">Cost</th>
                <th className="table-header">Stock</th>
                <th className="table-header">Warehouse</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{product.sku}</td>
                  <td className="table-cell">{product.name}</td>
                  <td className="table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="table-cell">₹{product.price.toLocaleString()}</td>
                  <td className="table-cell">₹{product.cost.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={product.stock < 20 ? 'text-red-600 font-semibold' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="table-cell">{product.warehouse}</td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button 
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found. Add your first product to get started.
          </div>
        )}
      </div>

      {/* Products Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            No products found. Add your first product to get started.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                </div>
                <div className="flex items-center space-x-2 ml-2">
                  {canEdit && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit Product"
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                    {product.category}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Warehouse</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{product.warehouse}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">₹{product.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cost</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">₹{product.cost.toLocaleString()}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className={`text-lg font-bold ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                    {product.stock} units
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="Lights">Lights</option>
                    <option value="Crafts">Crafts</option>
                    <option value="Décor">Décor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
                  <select
                    value={formData.warehouse}
                    onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                    className="input-field"
                  >
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="North Warehouse">North Warehouse</option>
                    <option value="South Warehouse">South Warehouse</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingProduct(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

