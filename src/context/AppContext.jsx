import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  // Check localStorage for existing user session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [products, setProducts] = useState([
    {
      id: 1,
      sku: 'DL-LED-001',
      name: 'LED Pendant Light',
      category: 'Lights',
      price: 2500,
      cost: 1800,
      stock: 45,
      warehouse: 'Main Warehouse',
      image: null,
      specs: { wattage: '12W', color: 'Warm White' }
    },
    {
      id: 2,
      sku: 'DL-CRAFT-001',
      name: 'Handmade Wall Art',
      category: 'Crafts',
      price: 1200,
      cost: 800,
      stock: 12,
      warehouse: 'Main Warehouse',
      image: null,
      specs: { material: 'Wood', size: '24x36' }
    },
    {
      id: 3,
      sku: 'DL-DECOR-001',
      name: 'Modern Vase Set',
      category: 'Décor',
      price: 1800,
      cost: 1200,
      stock: 8,
      warehouse: 'Main Warehouse',
      image: null,
      specs: { material: 'Ceramic', pieces: '3' }
    }
  ])

  const [warehouses, setWarehouses] = useState([
    { id: 1, name: 'Main Warehouse', location: 'Mumbai' },
    { id: 2, name: 'North Warehouse', location: 'Delhi' },
    { id: 3, name: 'South Warehouse', location: 'Bangalore' }
  ])

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 1,
      poNumber: 'PO-2024-001',
      supplier: 'Lighting Solutions Inc',
      status: 'pending',
      items: [
        { productId: 1, quantity: 50, unitPrice: 1800 }
      ],
      total: 90000,
      createdAt: new Date('2024-01-15'),
      expectedDate: new Date('2024-01-25')
    }
  ])

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Lighting Solutions Inc', contact: '9876543210', email: 'contact@lightingsolutions.com' },
    { id: 2, name: 'Craft Supplies Co', contact: '9876543211', email: 'info@craftsupplies.com' }
  ])

  const [activityLog, setActivityLog] = useState([
    {
      id: 1,
      action: 'Stock Updated',
      user: 'Admin User',
      details: 'LED Pendant Light stock changed from 40 to 45',
      timestamp: new Date('2024-01-20T10:30:00')
    },
    {
      id: 2,
      action: 'Product Created',
      user: 'Admin User',
      details: 'New product: Modern Vase Set (DL-DECOR-001)',
      timestamp: new Date('2024-01-19T14:20:00')
    }
  ])

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length + 1,
      stock: product.stock || 0
    }
    setProducts([...products, newProduct])
    logActivity('Product Created', `New product: ${product.name} (${product.sku})`)
  }

  const updateProduct = (id, updates) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p))
    const product = products.find(p => p.id === id)
    logActivity('Product Updated', `${product.name} (${product.sku}) was updated`)
  }

  const updateStock = (productId, warehouseId, quantity, type = 'adjust') => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newStock = type === 'add' ? p.stock + quantity : quantity
        logActivity('Stock Updated', `${p.name} stock changed from ${p.stock} to ${newStock}`)
        return { ...p, stock: newStock }
      }
      return p
    }))
  }

  const createPurchaseOrder = (po) => {
    const newPO = {
      ...po,
      id: purchaseOrders.length + 1,
      poNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date()
    }
    setPurchaseOrders([...purchaseOrders, newPO])
    logActivity('Purchase Order Created', `PO ${newPO.poNumber} created`)
  }

  const receivePurchaseOrder = (poId) => {
    const po = purchaseOrders.find(p => p.id === poId)
    if (po) {
      po.items.forEach(item => {
        updateStock(item.productId, 1, item.quantity, 'add')
      })
      setPurchaseOrders(purchaseOrders.map(p => 
        p.id === poId ? { ...p, status: 'received', receivedAt: new Date() } : p
      ))
      logActivity('Purchase Order Received', `PO ${po.poNumber} received`)
    }
  }

  const logActivity = (action, details) => {
    const newLog = {
      id: activityLog.length + 1,
      action,
      user: user?.name || 'System',
      details,
      timestamp: new Date()
    }
    setActivityLog([newLog, ...activityLog])
  }

  const getLowStockItems = () => {
    return products.filter(p => p.stock < 20)
  }

  const getTotalStockValue = () => {
    return products.reduce((sum, p) => sum + (p.stock * p.cost), 0)
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    logActivity('User Logged In', `${userData.name} logged in`)
  }

  const logout = () => {
    if (user) {
      logActivity('User Logged Out', `${user.name} logged out`)
    }
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    products,
    warehouses,
    purchaseOrders,
    suppliers,
    activityLog,
    addProduct,
    updateProduct,
    updateStock,
    createPurchaseOrder,
    receivePurchaseOrder,
    logActivity,
    getLowStockItems,
    getTotalStockValue,
    setSuppliers,
    login,
    logout
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

