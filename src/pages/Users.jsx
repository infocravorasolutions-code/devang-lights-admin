import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users as UsersIcon, Plus, Edit, Trash2, Shield, User, UserCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Users = () => {
  const { user } = useApp()
  const navigate = useNavigate()
  const [users] = useState([
    { id: 1, name: 'Admin User', email: 'admin@devanglights.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Manager One', email: 'manager@devanglights.com', role: 'manager', status: 'active' },
    { id: 3, name: 'Staff Member', email: 'staff@devanglights.com', role: 'staff', status: 'active' },
  ])

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="text-purple-600" size={20} />
      case 'manager':
        return <UserCheck className="text-blue-600" size={20} />
      default:
        return <User className="text-gray-600" size={20} />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User & Role Management</h1>
        <button className="btn-primary flex items-center space-x-2 text-sm sm:text-base">
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Add User</span>
        </button>
      </div>

      {/* Role Permissions Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <Shield className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Admin</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Full access to all modules</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Manage all products & inventory</li>
            <li>• Create & manage POs</li>
            <li>• User management</li>
            <li>• View all reports</li>
          </ul>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <UserCheck className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Manager</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Manage inventory & orders</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• View & edit products</li>
            <li>• Manage inventory</li>
            <li>• Create purchase orders</li>
            <li>• View reports</li>
          </ul>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3 mb-3">
            <User className="text-gray-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Staff</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Basic operations access</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• View products & inventory</li>
            <li>• Add stock counts</li>
            <li>• Receive purchase orders</li>
            <li>• Limited report access</li>
          </ul>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="text-primary-600" size={20} />
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="text-primary-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getRoleIcon(user.role)}
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                  user.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200 flex items-center space-x-2">
              <button className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-2">
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button className="flex-1 btn-secondary text-sm flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50">
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users

