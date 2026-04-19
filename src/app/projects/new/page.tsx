'use client';

import { createProject } from '@/lib/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        code: formData.get('code') as string,
        name: formData.get('name') as string,
        clientId: formData.get('clientId') ? Number(formData.get('clientId')) : undefined,
        contractorId: formData.get('contractorId') ? Number(formData.get('contractorId')) : undefined,
        startDate: formData.get('startDate') as string || undefined,
        endDate: formData.get('endDate') as string || undefined,
        budget: Number(formData.get('budget')) || 0,
      };

      await createProject(data);
      router.push('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proyecto');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo Proyecto</h1>

          <form action={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="PROJ-001"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nombre del proyecto"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar cliente</option>
                  <option value="1">Cliente Ejemplo 1</option>
                  <option value="2">Cliente Ejemplo 2</option>
                </select>
              </div>

              <div>
                <label htmlFor="contractorId" className="block text-sm font-medium text-gray-700 mb-2">
                  Contratista
                </label>
                <select
                  id="contractorId"
                  name="contractorId"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar contratista</option>
                  <option value="1">Contratista Ejemplo 1</option>
                  <option value="2">Contratista Ejemplo 2</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Presupuesto
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                step="0.01"
                min="0"
                defaultValue="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? 'Creando...' : 'Crear Proyecto'}
              </button>
              <Link
                href="/projects"
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 text-center font-medium"
              >
                Cancelar
              </Link>
            </div>
          </form>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Estados del Proyecto</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li><strong>Planificación:</strong> Estado inicial, se pueden asignar materiales.</li>
              <li><strong>Asignación:</strong> Materiales reservados pero no despachados.</li>
              <li><strong>En Proceso:</strong> Primer despacho realizado (automático).</li>
              <li><strong>Pausado:</strong> Proyecto temporalmente detenido.</li>
              <li><strong>Completo:</strong> Todos los materiales despachados.</li>
              <li><strong>Cerrado:</strong> Conciliación documental y financiera completada.</li>
              <li><strong>Cancelado:</strong> Proyecto cancelado, permite devoluciones.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
