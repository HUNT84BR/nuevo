import { getInventoryMovements, getProducts } from '@/lib/actions';
import Link from 'next/link';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

export default async function InventoryPage() {
  const movements = await getInventoryMovements(undefined, 50);
  const products = await getProducts();

  // Calcular productos con stock bajo
  const lowStockProducts = products.filter(p => Number(p.currentStock) <= Number(p.minStock));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">WMS/ERP</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/projects" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Proyectos
          </Link>
          <Link href="/purchase-orders" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Compras
          </Link>
          <Link href="/reception" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Recepción
          </Link>
          <Link href="/inventory" className="flex items-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg">
            Inventario
          </Link>
          <Link href="/calendar" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Calendario
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventario</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <Package className="w-12 h-12 text-primary opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stock Total Valorizado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${products.reduce((sum, p) => sum + Number(p.currentStock) * Number(p.unitCostAvg), 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-success opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Stock Bajo</p>
                  <p className="text-2xl font-bold text-danger">{lowStockProducts.length}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-warning opacity-50" />
              </div>
            </div>
          </div>

          {/* Products with Low Stock */}
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Productos con Stock Bajo
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-red-700 uppercase">
                      <th className="pb-3">SKU</th>
                      <th className="pb-3">Producto</th>
                      <th className="pb-3">Stock Actual</th>
                      <th className="pb-3">Stock Mínimo</th>
                      <th className="pb-3">Familia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-200">
                    {lowStockProducts.map(product => (
                      <tr key={product.id}>
                        <td className="py-3 text-sm font-medium text-red-900">{product.sku}</td>
                        <td className="py-3 text-sm text-red-800">{product.name}</td>
                        <td className="py-3 text-sm text-red-900 font-bold">{Number(product.currentStock).toFixed(2)}</td>
                        <td className="py-3 text-sm text-red-700">{Number(product.minStock).toFixed(2)}</td>
                        <td className="py-3 text-sm text-red-700">{product.family?.name || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Catálogo de Productos</h2>
              <input
                type="text"
                placeholder="Buscar producto..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Familia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mínimo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo Prom.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.slice(0, 20).map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.family?.name || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${Number(product.currentStock) <= Number(product.minStock) ? 'text-red-600' : 'text-gray-900'}`}>
                        {Number(product.currentStock).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{Number(product.minStock).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${Number(product.unitCostAvg).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      {product.isActive ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Activo</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Inactivo</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length > 20 && (
              <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
                Mostrando 20 de {products.length} productos
              </div>
            )}
          </div>

          {/* Recent Movements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Movimientos Recientes</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación Destino</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map(movement => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(movement.timestamp).toLocaleString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{movement.product.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {movement.movementType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${Number(movement.quantity) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(movement.quantity) > 0 ? '+' : ''}{Number(movement.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {movement.referenceType}-{movement.referenceId || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {movement.destLocation?.fullPath || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
