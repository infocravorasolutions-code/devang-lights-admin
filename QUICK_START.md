# Quick Start Guide

## Installation

1. Navigate to the project directory:
```bash
cd devang-lights-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## Project Structure

```
devang-lights-admin/
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout.jsx    # Main layout with sidebar navigation
│   ├── context/          # React Context for state management
│   │   └── AppContext.jsx # Global app state
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── Inventory.jsx
│   │   ├── PurchaseOrders.jsx
│   │   ├── MediaLibrary.jsx
│   │   ├── Reports.jsx
│   │   ├── Users.jsx
│   │   └── ActivityLog.jsx
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Features Implemented

✅ **Dashboard**
- Total SKUs, low stock alerts, stock valuation
- Quick actions: Add product, Add stock, Create PO
- Recent activity feed

✅ **Products (Catalog Management)**
- Add/edit products with SKU, name, category, pricing
- Search and filter by category
- Product listing table
- Import/Export buttons (UI ready)

✅ **Inventory & Warehouse**
- Warehouse-wise stock overview
- View stock per warehouse
- Add/adjust stock functionality
- Stock transfer UI (ready for implementation)
- Real-time availability tracking

✅ **Purchase Orders & Suppliers**
- Create purchase orders with multiple items
- Track PO status (pending, received, cancelled)
- Supplier management
- Receive purchase orders (updates inventory)

✅ **Media Library**
- Upload media files (images, PDFs)
- Search and filter media
- Media grid view

✅ **Reports**
- Stock valuation report
- Category breakdown
- Fast/slow-moving items analysis
- Stock movement report

✅ **User & Role Management**
- Admin, Manager, Staff roles
- Role permissions display
- User management table

✅ **Activity Log**
- Track all changes (products, stock, POs)
- Search and filter activities
- Timestamp and user tracking

## Mobile Responsive

The entire application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

The sidebar collapses to a hamburger menu on mobile devices.

## Next Steps

1. **Backend Integration**: Connect to your backend API
2. **Authentication**: Add login/logout functionality
3. **File Upload**: Implement actual file upload for media library
4. **Excel Import**: Implement CSV/Excel import for products
5. **Barcode Scanning**: Add barcode/QR scanning support
6. **Advanced Reports**: Add more detailed reporting features

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed or embedded in a React Native WebView.

