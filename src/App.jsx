import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import PurchaseOrders from './pages/PurchaseOrders'
import MediaLibrary from './pages/MediaLibrary'
import Reports from './pages/Reports'
import Users from './pages/Users'
import ActivityLog from './pages/ActivityLog'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route 
              path="media" 
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                  <MediaLibrary />
                </RoleProtectedRoute>
              } 
            />
            <Route path="reports" element={<Reports />} />
            <Route 
              path="users" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Users />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="activity-log" 
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                  <ActivityLog />
                </RoleProtectedRoute>
              } 
            />
          </Route>
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App

