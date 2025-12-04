import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, ShoppingCart, CheckCircle, Clock, XCircle, Eye, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const PurchaseOrders = () => {
  const { purchaseOrders, suppliers, products, createPurchaseOrder, receivePurchaseOrder, user } = useApp()
  const isAdmin = user?.role === 'admin'
  const isManager = user?.role === 'manager'
  const isStaff = user?.role === 'staff'
  const canCreatePO = isAdmin || isManager
  const canCancelPO = isAdmin // Only admin can cancel POs
  const canReceivePO = isAdmin || isManager || isStaff // All can receive
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    supplier: '',
    items: [{ productId: '', quantity: '', unitPrice: '' }],
    expectedDate: ''
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received':
        return <CheckCircle className="text-green-600" size={20} />
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />
      default:
        return <Clock className="text-gray-600" size={20} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '', unitPrice: '' }]
    })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    
    // Auto-fill unit price if product is selected
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value))
      if (product) {
        newItems[index].unitPrice = product.cost
      }
    }
    
    setFormData({ ...formData, items: newItems })
  }

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const po = {
      supplier: formData.supplier,
      items: formData.items.map(item => ({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice)
      })),
      expectedDate: new Date(formData.expectedDate),
      total: formData.items.reduce((sum, item) => 
        sum + (parseInt(item.quantity) * parseFloat(item.unitPrice)), 0
      )
    }
    createPurchaseOrder(po)
    setShowCreateModal(false)
    setFormData({
      supplier: '',
      items: [{ productId: '', quantity: '', unitPrice: '' }],
      expectedDate: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Purchase Orders</h1>
        {canCreatePO && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Create Purchase Order</span>
            <span className="sm:hidden">Create PO</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total POs</p>
              <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
            </div>
            <ShoppingCart className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {purchaseOrders.filter(po => po.status === 'pending').length}
              </p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="text-2xl font-bold text-green-600">
                {purchaseOrders.filter(po => po.status === 'received').length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </div>
      </div>

      {/* Purchase Orders Table - Desktop */}
      <div className="hidden lg:block card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">PO Number</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Items</th>
                <th className="table-header">Total Amount</th>
                <th className="table-header">Status</th>
                <th className="table-header">Expected Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchaseOrders.map((po) => {
                const productNames = po.items.map(item => {
                  const product = products.find(p => p.id === item.productId)
                  return product ? product.name : 'Unknown'
                }).join(', ')
                
                return (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{po.poNumber}</td>
                    <td className="table-cell">{po.supplier}</td>
                    <td className="table-cell">
                      <span className="text-sm" title={productNames}>
                        {po.items.length} item(s)
                      </span>
                    </td>
                    <td className="table-cell font-medium">₹{po.total.toLocaleString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(po.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      {po.expectedDate ? format(new Date(po.expectedDate), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        {po.status === 'pending' && canReceivePO && (
                          <button
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                            title="Receive Purchase Order"
                          >
                            Receive
                          </button>
                        )}
                        {po.status === 'pending' && canCancelPO && (
                          <button
                            className="text-red-600 hover:text-red-700"
                            title="Cancel Purchase Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button className="text-primary-600 hover:text-primary-700" title="View Details">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {purchaseOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No purchase orders yet. Create your first PO to get started.
          </div>
        )}
      </div>

      {/* Purchase Orders Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {purchaseOrders.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            No purchase orders yet. Create your first PO to get started.
          </div>
        ) : (
          purchaseOrders.map((po) => {
            const productNames = po.items.map(item => {
              const product = products.find(p => p.id === item.productId)
              return product ? product.name : 'Unknown'
            }).join(', ')
            
            return (
              <div key={po.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{po.poNumber}</h3>
                    <p className="text-sm text-gray-500 mt-1">{po.supplier}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    {getStatusIcon(po.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(po.status)}`}>
                      {po.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="text-sm font-medium text-gray-900 mt-1" title={productNames}>
                      {po.items.length} item(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{po.total.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Expected Date</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {po.expectedDate ? format(new Date(po.expectedDate), 'MMM d, yyyy') : '-'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 flex items-center space-x-2">
                  {po.status === 'pending' && canReceivePO && (
                    <button
                      onClick={() => receivePurchaseOrder(po.id)}
                      className="flex-1 btn-primary text-sm"
                    >
                      Receive
                    </button>
                  )}
                  {po.status === 'pending' && canCancelPO && (
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Cancel PO"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button className="p-2 text-primary-600 hover:bg-primary-50 rounded" title="View Details">
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Create PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create Purchase Order</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Date</label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Items</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="input-field"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="input-field"
                        required
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          ₹{item.quantity && item.unitPrice ? (parseInt(item.quantity) * parseFloat(item.unitPrice)).toLocaleString() : '0'}
                        </span>
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>
                      ₹{formData.items.reduce((sum, item) => 
                        sum + (item.quantity && item.unitPrice ? 
                          parseInt(item.quantity) * parseFloat(item.unitPrice) : 0), 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrders

