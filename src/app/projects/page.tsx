import { getProjects, updateProjectStatus } from '@/lib/actions';
import Link from 'next/link';
import { Plus, Eye, ClipboardCheck, PauseCircle, CheckCircle, XCircle } from 'lucide-react';

export default async function ProjectsPage() {
  const projects = await getProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'bg-gray-100 text-gray-800';
      case 'ASSIGNMENT': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar placeholder */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">WMS/ERP</span>
        </div>
        <nav className="p-4 space-y-1">
          <Link href="/" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Dashboard
          </Link>
          <Link href="/projects" className="flex items-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg">
            Proyectos
          </Link>
          <Link href="/purchase-orders" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Compras
          </Link>
          <Link href="/reception" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
            <Link
              href="/projects/new"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Proyecto
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex gap-4 flex-wrap">
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
                <option value="">Todos los estados</option>
                <option value="PLANNING">Planificación</option>
                <option value="ASSIGNMENT">Asignación</option>
                <option value="IN_PROGRESS">En Proceso</option>
                <option value="PAUSED">Pausado</option>
                <option value="COMPLETED">Completo</option>
                <option value="CLOSED">Cerrado</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presupuesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materiales
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No hay proyectos registrados. Crea el primero para comenzar.
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.client?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Number(project.budget).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.materials.length} ítems
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-primary hover:text-blue-700"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          
                          {project.status === 'PLANNING' && (
                            <form action={async () => {
                              'use server';
                              await updateProjectStatus(project.id, 'ASSIGNMENT');
                            }}>
                              <button type="submit" className="text-blue-600 hover:text-blue-800" title="Asignar materiales">
                                <ClipboardCheck className="w-5 h-5" />
                              </button>
                            </form>
                          )}
                          
                          {project.status === 'IN_PROGRESS' && (
                            <form action={async () => {
                              'use server';
                              await updateProjectStatus(project.id, 'PAUSED');
                            }}>
                              <button type="submit" className="text-orange-600 hover:text-orange-800" title="Pausar">
                                <PauseCircle className="w-5 h-5" />
                              </button>
                            </form>
                          )}
                          
                          {project.status === 'PAUSED' && (
                            <form action={async () => {
                              'use server';
                              await updateProjectStatus(project.id, 'IN_PROGRESS');
                            }}>
                              <button type="submit" className="text-green-600 hover:text-green-800" title="Reanudar">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            </form>
                          )}
                          
                          {(project.status === 'COMPLETED' || project.status === 'CANCELLED') && (
                            <Link
                              href={`/projects/${project.id}/returns`}
                              className="text-red-600 hover:text-red-800"
                              title="Gestionar devoluciones"
                            >
                              <XCircle className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
