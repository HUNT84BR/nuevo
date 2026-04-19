// Seed script para poblar la base de datos con datos iniciales

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // 1. Crear Familias de Productos
  const families = await Promise.all([
    prisma.family.upsert({
      where: { code: 'ELECT' },
      update: {},
      create: { code: 'ELECT', name: 'Eléctricos' },
    }),
    prisma.family.upsert({
      where: { code: 'PLOM' },
      update: {},
      create: { code: 'PLOM', name: 'Plomería' },
    }),
    prisma.family.upsert({
      where: { code: 'CONST' },
      update: {},
      create: { code: 'CONST', name: 'Construcción' },
    }),
    prisma.family.upsert({
      where: { code: 'HERR' },
      update: {},
      create: { code: 'HERR', name: 'Herramientas' },
    }),
  ]);

  console.log(`✓ ${families.length} familias creadas`);

  // 2. Crear Partners (Clientes, Proveedores, Contratistas)
  const partners = await Promise.all([
    prisma.partner.upsert({
      where: { id: 1 },
      update: {},
      create: {
        type: 'CLIENT',
        taxId: 'CLI-001',
        name: 'Constructora ABC',
        contactInfo: 'contacto@abc.com',
      },
    }),
    prisma.partner.upsert({
      where: { id: 2 },
      update: {},
      create: {
        type: 'SUPPLIER',
        taxId: 'PROV-001',
        name: 'Suministros Industriales SA',
        contactInfo: 'ventas@suministros.com',
      },
    }),
    prisma.partner.upsert({
      where: { id: 3 },
      update: {},
      create: {
        type: 'CONTRACTOR',
        taxId: 'CONT-001',
        name: 'Servicios Técnicos XYZ',
        contactInfo: 'info@xyz.com',
      },
    }),
  ]);

  console.log(`✓ ${partners.length} partners creados`);

  // 3. Crear Productos
  const products = await Promise.all([
    prisma.product.upsert({
      where: { sku: 'CABLE-2.5' },
      update: {},
      create: {
        sku: 'CABLE-2.5',
        name: 'Cable Eléctrico 2.5mm',
        familyId: families[0].id,
        minStock: 100,
        currentStock: 500,
        unitCostAvg: 2.50,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'TUBO-PVC-1/2' },
      update: {},
      create: {
        sku: 'TUBO-PVC-1/2',
        name: 'Tubo PVC 1/2 pulgada',
        familyId: families[1].id,
        minStock: 50,
        currentStock: 200,
        unitCostAvg: 5.00,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'CEMENTO-50KG' },
      update: {},
      create: {
        sku: 'CEMENTO-50KG',
        name: 'Cemento Portland 50kg',
        familyId: families[2].id,
        minStock: 20,
        currentStock: 80,
        unitCostAvg: 150.00,
      },
    }),
    prisma.product.upsert({
      where: { sku: 'TALADRO-IND' },
      update: {},
      create: {
        sku: 'TALADRO-IND',
        name: 'Taladro Industrial',
        familyId: families[3].id,
        minStock: 5,
        currentStock: 15,
        unitCostAvg: 2500.00,
      },
    }),
  ]);

  console.log(`✓ ${products.length} productos creados`);

  // 4. Crear Almacenes
  const warehouses = await Promise.all([
    prisma.warehouse.upsert({
      where: { code: 'MAIN' },
      update: {},
      create: { code: 'MAIN', name: 'Almacén Principal', type: 'MAIN' },
    }),
    prisma.warehouse.upsert({
      where: { code: 'RECEP' },
      update: {},
      create: { code: 'RECEP', name: 'Recepción', type: 'RECEPTION' },
    }),
  ]);

  console.log(`✓ ${warehouses.length} almacenes creados`);

  // 5. Crear Ubicaciones
  const locations = [];
  for (const warehouse of warehouses) {
    for (let rack = 1; rack <= 3; rack++) {
      for (let shelf = 1; shelf <= 4; shelf++) {
        for (let bin = 1; bin <= 2; bin++) {
          const location = await prisma.location.create({
            data: {
              warehouseId: warehouse.id,
              rackCode: `R${rack.toString().padStart(2, '0')}`,
              shelfCode: `S${shelf.toString().padStart(2, '0')}`,
              binCode: `B${bin}`,
              fullPath: `${warehouse.code}-R${rack.toString().padStart(2, '0')}-S${shelf.toString().padStart(2, '0')}-B${bin}`,
            },
          });
          locations.push(location);
        }
      }
    }
  }

  console.log(`✓ ${locations.length} ubicaciones creadas`);

  // 6. Crear Plantilla de Materiales
  const template = await prisma.materialTemplate.create({
    data: {
      name: 'Instalación Eléct Básica',
      version: 1,
      isScalable: true,
      unitFactor: 1,
      items: {
        create: [
          { productId: products[0].id, quantityBase: 100 }, // Cable
          { productId: products[3].id, quantityBase: 1 },   // Taladro
        ],
      },
    },
  });

  console.log(`✓ Plantilla creada: ${template.name}`);

  // 7. Crear Proyecto de Ejemplo
  const project = await prisma.project.create({
    data: {
      code: 'PROJ-001',
      name: 'Remodelación Oficina Central',
      clientId: partners[0].id,
      contractorId: partners[2].id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      budget: 50000,
      status: 'PLANNING',
    },
  });

  console.log(`✓ Proyecto creado: ${project.name}`);

  // 8. Crear Orden de Compra
  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber: 'PO-2024-001',
      supplierId: partners[1].id,
      projectId: project.id,
      type: 'PROJECT',
      status: 'PROCESSING',
      lines: {
        create: [
          {
            productId: products[0].id,
            quantityOrdered: 200,
            unitPrice: 2.50,
          },
          {
            productId: products[1].id,
            quantityOrdered: 100,
            unitPrice: 5.00,
          },
        ],
      },
    },
  });

  console.log(`✓ Orden de compra creada: ${po.poNumber}`);

  // 9. Crear Evento de Calendario
  const event = await prisma.calendarEvent.create({
    data: {
      title: 'Inicio de Obra',
      description: 'Comienzo de trabajos de remodelación',
      startDatetime: new Date(),
      endDatetime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      colorCode: '#3b82f6',
      projectId: project.id,
      reminderMinutes: 1440,
    },
  });

  console.log(`✓ Evento de calendario creado: ${event.title}`);

  console.log('\n✅ Seed completado exitosamente!');
  console.log('\nDatos creados:');
  console.log(`  - ${families.length} familias de productos`);
  console.log(`  - ${partners.length} partners (clientes/proveedores/contratistas)`);
  console.log(`  - ${products.length} productos`);
  console.log(`  - ${warehouses.length} almacenes`);
  console.log(`  - ${locations.length} ubicaciones`);
  console.log(`  - 1 plantilla de materiales`);
  console.log(`  - 1 proyecto de ejemplo`);
  console.log(`  - 1 orden de compra`);
  console.log(`  - 1 evento de calendario`);
}

main()
  .catch((e) => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
