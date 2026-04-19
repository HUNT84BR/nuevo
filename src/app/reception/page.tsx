import { getReceiptBatches, validateReceiptBatch, getPurchaseOrders } from '@/lib/actions';
import Link from 'next/link';
import { CheckCircle, Package, AlertCircle } from 'lucide-react';

export default async function ReceptionPage() {
  const batches = await getReceiptBatches();
  const pendingPOs = await getPurchaseOrders('PROCESSING');

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
          <Link href="/reception" className="flex items-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg">
            Recepción
          </Link>
          <Link href="/inventory" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Inventario
          </Link>
          <Link href="/calendar" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Calendario
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Recepción de Mercancía</h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Lotes Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{batches.filter(b => !b.isValidated).length}</p>
                </div>
                <Package className="w-12 h-12 text-warning opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Lotes Validados</p>
                  <p className="text-2xl font-bold text-gray-900">{batches.filter(b => b.isValidated).length}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-success opacity-50" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Órdenes en Proceso</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPOs.length}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-primary opacity-50" />
              </div>
            </div>
          </div>

          {/* Create New Batch */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nueva Recepción</h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="poSelect" className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de Compra
                </label>
                <select
                  id="poSelect"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar orden de compra...</option>
                  {pendingPOs.map(po => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber} - {po.supplier?.name || 'Sin proveedor'} ({po.lines.length} ítems)
                    </option>
                  ))}
                </select>
              </div>
              <Link
                href="/reception/new"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Crear Lote
              </Link>
            </div>
          </div>

          {/* Batches Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lotes de Recepción</h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número de Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden de Compra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ítems
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No hay lotes de recepción registrados.
                    </td>
                  </tr>
                ) : (
                  batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {batch.batchNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batch.po.poNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {batch.po.supplier?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(batch.receivedAt).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {batch.lines.length} ítems
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {batch.isValidated ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Validado
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {!batch.isValidated && (
                          <form action={async () => {
                            'use server';
                            await validateReceiptBatch(batch.id);
                          }}>
                            <button
                              type="submit"
                              className="text-green-600 hover:text-green-800 flex items-center justify-end gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Validar
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Flujo de Recepción</h3>
            <ol className="text-blue-700 space-y-2 list-decimal list-inside">
              <li>Crear un nuevo lote vinculado a una orden de compra en estado "En Proceso".</li>
              <li>Registrar cantidades físicas recibidas para cada ítem.</li>
              <li>Validar el lote para incrementar automáticamente el stock en el ledger de inventarios.</li>
              <li>El sistema actualizará la orden de compra y verificará si está completa.</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
