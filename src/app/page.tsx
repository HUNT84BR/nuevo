import Link from 'next/link';
import { Package, ClipboardList, ShoppingCart, Calendar, Warehouse, BarChart3 } from 'lucide-react';

const navigation = [
  { name: 'Proyectos', href: '/projects', icon: ClipboardList },
  { name: 'Compras', href: '/purchase-orders', icon: ShoppingCart },
  { name: 'Recepción', href: '/reception', icon: Warehouse },
  { name: 'Inventario', href: '/inventory', icon: Package },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <BarChart3 className="w-8 h-8 text-primary" />
          <span className="ml-3 text-xl font-bold text-gray-900">WMS/ERP</span>
        </div>
        
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <ClipboardList className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-sm font-medium text-gray-500">Proyectos Activos</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <ShoppingCart className="w-8 h-8 text-success mb-4" />
              <h3 className="text-sm font-medium text-gray-500">Órdenes en Proceso</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <Package className="w-8 h-8 text-warning mb-4" />
              <h3 className="text-sm font-medium text-gray-500">Productos Stock Bajo</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <Calendar className="w-8 h-8 text-danger mb-4" />
              <h3 className="text-sm font-medium text-gray-500">Eventos Hoy</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/projects/new"
                className="flex items-center justify-center px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nuevo Proyecto
              </Link>
              <Link
                href="/purchase-orders/new"
                className="flex items-center justify-center px-4 py-3 bg-success text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Nueva Compra
              </Link>
              <Link
                href="/reception"
                className="flex items-center justify-center px-4 py-3 bg-warning text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Registrar Recepción
              </Link>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Sistema WMS/ERP</h3>
            <p className="text-blue-700">
              Este sistema permite gestionar proyectos, compras, recepciones e inventario con trazabilidad completa.
              Utiliza un ledger de movimientos para garantizar la integridad del stock.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
