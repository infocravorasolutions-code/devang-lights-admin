import { useState } from 'react'
import { Upload, Image as ImageIcon, FileText, X, Search } from 'lucide-react'

const MediaLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [mediaItems] = useState([
    { id: 1, name: 'LED Light Product.jpg', type: 'image', size: '2.4 MB', uploaded: '2024-01-15' },
    { id: 2, name: 'Product Catalog.pdf', type: 'pdf', size: '5.1 MB', uploaded: '2024-01-14' },
    { id: 3, name: 'Wall Art Sample.png', type: 'image', size: '1.8 MB', uploaded: '2024-01-13' },
  ])

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const handleFileUpload = (e) => {
    const files = e.target.files
    // File upload logic would go here
    console.log('Files to upload:', files)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Media Library</h1>
        <label className="btn-primary flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
          <Upload size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>Upload Media</span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="pdf">PDFs</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => (
          <div key={item.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              {item.type === 'image' ? (
                <ImageIcon className="text-gray-400" size={32} />
              ) : (
                <FileText className="text-gray-400" size={32} />
              )}
            </div>
            <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
              {item.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">{item.size}</p>
            <div className="mt-2 flex items-center justify-between">
              <button className="text-primary-600 hover:text-primary-700 text-xs">
                Use
              </button>
              <button className="text-red-600 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="card text-center py-12">
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No media files found</p>
          <p className="text-sm text-gray-400 mt-1">Upload your first file to get started</p>
        </div>
      )}
    </div>
  )
}

export default MediaLibrary

