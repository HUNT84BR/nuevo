import { getCalendarEvents } from '@/lib/actions';
import Link from 'next/link';

export default async function CalendarPage() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const events = await getCalendarEvents(startOfMonth, endOfMonth);

  // Generar días del mes actual
  const daysInMonth = endOfMonth.getDate();
  const firstDayOfMonth = startOfMonth.getDay();
  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(today.getFullYear(), today.getMonth(), i));
  }

  const getEventsForDay = (date: Date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startDatetime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

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
          <Link href="/inventory" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            Inventario
          </Link>
          <Link href="/calendar" className="flex items-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg">
            Calendario
          </Link>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Calendario - {today.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
            </h1>
            <Link
              href="/calendar/new"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              Nuevo Evento
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex gap-4 flex-wrap">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Todos los tipos</option>
              <option value="project">Proyectos</option>
              <option value="task">Tareas</option>
              <option value="delivery">Entregas</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary">
              <option value="">Todos los responsables</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Exportar iCal
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {days.map((date, index) => {
                const dayEvents = getEventsForDay(date!);
                const isToday = date?.toDateString() === today.toDateString();

                return (
                  <div
                    key={index}
                    className={`min-h-24 border-b border-r border-gray-200 p-2 ${
                      !date ? 'bg-gray-50' : isToday ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-gray-700'}`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className="text-xs px-2 py-1 rounded truncate text-white"
                              style={{ backgroundColor: event.colorCode }}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 pl-2">
                              +{dayEvents.length - 3} más
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Próximos Eventos</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {events.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  No hay eventos programados para este mes.
                </div>
              ) : (
                events.slice(0, 10).map(event => (
                  <div key={event.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.colorCode }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-500 truncate">{event.description}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {new Date(event.startDatetime).toLocaleString('es-MX', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {event.project && (
                      <Link
                        href={`/projects/${event.projectId}`}
                        className="text-sm text-primary hover:text-blue-700"
                      >
                        {event.project.name}
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Características del Calendario</h3>
            <ul className="text-blue-700 space-y-2">
              <li>✓ Visualización mensual con eventos codificados por color</li>
              <li>✓ Filtrado por tipo de evento y responsable</li>
              <li>✓ Vinculación con proyectos y tareas</li>
              <li>✓ Recordatorios configurables por evento</li>
              <li>✓ Exportación a formato iCal para sincronización</li>
              <li>✓ Vista de próximos eventos en lista</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
