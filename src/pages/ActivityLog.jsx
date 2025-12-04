import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { FileText, Search, Filter } from 'lucide-react'
import { format } from 'date-fns'

const ActivityLog = () => {
  const { activityLog } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  const actions = ['all', 'Product Created', 'Product Updated', 'Stock Updated', 'Purchase Order Created', 'Purchase Order Received']

  const filteredLogs = activityLog.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = filterAction === 'all' || log.action === filterAction
    return matchesSearch && matchesAction
  })

  const getActionColor = (action) => {
    if (action.includes('Created')) return 'bg-green-100 text-green-800'
    if (action.includes('Updated')) return 'bg-blue-100 text-blue-800'
    if (action.includes('Received')) return 'bg-purple-100 text-purple-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Track all changes and activities in your system
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="input-field"
            >
              {actions.map(action => (
                <option key={action} value={action}>
                  {action === 'all' ? 'All Actions' : action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="card overflow-hidden p-0">
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <FileText className="text-primary-600 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">by {log.user}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {format(log.timestamp, 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">{log.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
            <p>No activities found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLog

