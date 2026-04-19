# WMS/ERP System

Sistema de gestión de almacenes y proyectos implementado con Next.js 14, Prisma ORM y SQLite.

## Características Principales

- **Gestión de Proyectos**: Ciclo completo desde planificación hasta cierre
- **Compras**: Órdenes globales y por proyecto con seguimiento de estados
- **Recepción**: Validación física con incremento automático de stock
- **Inventario**: Ledger de movimientos con trazabilidad completa
- **Calendario**: Eventos vinculados a proyectos con recordatorios
- **Ubicaciones**: Codificación de celda/bin (A-R02-S04-B3) para escaneo QR

## Requisitos Previos

- Node.js 18+ 
- npm o yarn

## Instalación

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Accede a http://localhost:3000

## Estructura del Proyecto

```
/workspace
├── prisma/
│   ├── schema.prisma      # Modelo de datos
│   └── seed.ts            # Script de inicialización
├── src/
│   ├── app/               # Rutas de Next.js App Router
│   │   ├── page.tsx       # Dashboard principal
│   │   ├── projects/      # Gestión de proyectos
│   │   ├── purchase-orders/ # Compras
│   │   ├── reception/     # Recepción
│   │   ├── inventory/     # Inventario
│   │   └── calendar/      # Calendario
│   ├── lib/
│   │   ├── prisma.ts      # Cliente Prisma
│   │   ├── actions.ts     # Server Actions
│   │   └── utils.ts       # Utilidades
│   └── types/
│       └── index.ts       # Tipos y schemas Zod
└── package.json
```

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run start        # Servidor de producción
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar esquema con BD
npm run db:seed      # Poblar datos iniciales
npm run db:studio    # Abrir Prisma Studio
```

## Tecnologías

- **Frontend**: Next.js 14 App Router, React 18, TailwindCSS
- **Backend**: Next.js Server Actions, Prisma ORM
- **Base de Datos**: SQLite (local)
- **Validación**: Zod schemas
- **Utilidades**: date-fns, lucide-react (iconos)
