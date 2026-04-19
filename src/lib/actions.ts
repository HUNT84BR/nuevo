import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProjects(status?: string) {
  const where = status ? { status } : {};
  return prisma.project.findMany({
    where,
    include: {
      client: true,
      contractor: true,
      materials: {
        include: {
          product: true,
        },
      },
      _count: {
        select: {
          purchaseOrders: true,
          calendarEvents: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(id: number) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      contractor: true,
      materials: {
        include: {
          product: {
            include: {
              family: true,
            },
          },
        },
      },
      purchaseOrders: {
        include: {
          supplier: true,
          lines: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

export async function createProject(data: {
  code: string;
  name: string;
  clientId?: number;
  contractorId?: number;
  startDate?: string;
  endDate?: string;
  budget: number;
}) {
  const project = await prisma.project.create({
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
  revalidatePath('/projects');
  return project;
}

export async function updateProjectStatus(id: number, status: string) {
  const project = await prisma.project.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/projects');
  return project;
}

export async function getProducts(search?: string, familyId?: number) {
  const where: any = { isActive: true };
  
  if (search) {
    where.OR = [
      { sku: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (familyId) {
    where.familyId = familyId;
  }
  
  return prisma.product.findMany({
    where,
    include: {
      family: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function getProductStock(productId: number) {
  const movements = await prisma.inventoryMovement.findMany({
    where: { productId },
    select: { quantity: true },
  });
  
  const totalStock = movements.reduce((sum, m) => sum + Number(m.quantity), 0);
  return totalStock;
}

export async function getPurchaseOrders(status?: string, projectId?: number) {
  const where: any = {};
  
  if (status) {
    where.status = status;
  }
  
  if (projectId) {
    where.projectId = projectId;
  }
  
  return prisma.purchaseOrder.findMany({
    where,
    include: {
      supplier: true,
      project: true,
      lines: {
        include: {
          product: true,
        },
      },
      receiptBatches: {
        include: {
          lines: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPurchaseOrderById(id: number) {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      project: true,
      lines: {
        include: {
          product: true,
          receiptLines: true,
        },
      },
      receiptBatches: {
        include: {
          lines: {
            include: {
              location: true,
            },
          },
        },
      },
    },
  });
}

export async function createPurchaseOrder(data: {
  poNumber: string;
  supplierId?: number;
  projectId?: number;
  type: 'GLOBAL' | 'PROJECT';
  lines: Array<{
    productId: number;
    quantityOrdered: number;
    unitPrice: number;
  }>;
}) {
  const po = await prisma.purchaseOrder.create({
    data: {
      poNumber: data.poNumber,
      supplierId: data.supplierId,
      projectId: data.projectId,
      type: data.type,
      lines: {
        create: data.lines.map(line => ({
          productId: line.productId,
          quantityOrdered: line.quantityOrdered,
          unitPrice: line.unitPrice,
        })),
      },
    },
    include: {
      lines: true,
    },
  });
  
  revalidatePath('/purchase-orders');
  return po;
}

export async function updatePurchaseOrderStatus(id: number, status: string) {
  const po = await prisma.purchaseOrder.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/purchase-orders');
  return po;
}

export async function getReceiptBatches(poId?: number, isValidated?: boolean) {
  const where: any = {};
  
  if (poId) {
    where.poId = poId;
  }
  
  if (isValidated !== undefined) {
    where.isValidated = isValidated;
  }
  
  return prisma.receiptBatch.findMany({
    where,
    include: {
      po: {
        include: {
          supplier: true,
        },
      },
      lines: {
        include: {
          poLine: {
            include: {
              product: true,
            },
          },
          location: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createReceiptBatch(data: {
  poId: number;
  lines: Array<{
    poLineId: number;
    quantityPhysical: number;
    locationId?: number;
  }>;
}) {
  const batchNumber = `RCT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const batch = await prisma.receiptBatch.create({
    data: {
      batchNumber,
      poId: data.poId,
      lines: {
        create: data.lines.map(line => ({
          poLineId: line.poLineId,
          quantityPhysical: line.quantityPhysical,
          locationId: line.locationId,
        })),
      },
    },
    include: {
      lines: {
        include: {
          poLine: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
  
  return batch;
}

export async function validateReceiptBatch(batchId: number) {
  const batch = await prisma.receiptBatch.findUnique({
    where: { id: batchId },
    include: {
      lines: {
        include: {
          poLine: {
            include: {
              product: true,
              po: true,
            },
          },
          location: true,
        },
      },
    },
  });
  
  if (!batch) {
    throw new Error('Lote de recepción no encontrado');
  }
  
  // Transacción para actualizar stock y movimientos
  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear movimientos de inventario
    for (const line of batch.lines) {
      const receptionLocation = await tx.location.findFirst({
        where: { 
          warehouse: { type: 'RECEPTION' },
          isActive: true 
        },
      });
      
      await tx.inventoryMovement.create({
        data: {
          productId: line.poLine.productId,
          quantity: line.quantityPhysical,
          movementType: 'PURCHASE_IN',
          referenceType: 'PO',
          referenceId: line.poLine.poId,
          destLocationId: receptionLocation?.id || null,
          batchId: batch.id,
        },
      });
      
      // 2. Actualizar línea de PO
      await tx.purchaseOrderLine.update({
        where: { id: line.poLineId },
        data: {
          quantityReceived: {
            increment: line.quantityPhysical,
          },
        },
      });
      
      // 3. Actualizar stock del producto (denormalizado)
      await tx.product.update({
        where: { id: line.poLine.productId },
        data: {
          currentStock: {
            increment: line.quantityPhysical,
          },
        },
      });
    }
    
    // 4. Validar el batch
    const updatedBatch = await tx.receiptBatch.update({
      where: { id: batchId },
      data: { isValidated: true },
    });
    
    // 5. Verificar si la PO está completa
    const po = await tx.purchaseOrder.findUnique({
      where: { id: batch.poId },
      include: {
        lines: true,
      },
    });
    
    if (po) {
      const allLinesComplete = po.lines.every(line => 
        Number(line.quantityReceived) + Number(line.quantityCancelled) >= Number(line.quantityOrdered)
      );
      
      if (allLinesComplete) {
        await tx.purchaseOrder.update({
          where: { id: po.id },
          data: { status: 'COMPLETED' },
        });
      }
    }
    
    return updatedBatch;
  });
  
  revalidatePath('/reception');
  revalidatePath('/purchase-orders');
  revalidatePath('/inventory');
  
  return result;
}

export async function getInventoryMovements(productId?: number, limit: number = 100) {
  const where: any = {};
  
  if (productId) {
    where.productId = productId;
  }
  
  return prisma.inventoryMovement.findMany({
    where,
    include: {
      product: true,
      sourceLocation: true,
      destLocation: true,
    },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

export async function dispatchMaterials(data: {
  projectId: number;
  items: Array<{
    productId: number;
    quantity: number;
    sourceLocationId: number;
  }>;
}) {
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });
  
  if (!project) {
    throw new Error('Proyecto no encontrado');
  }
  
  // Validar estado del proyecto
  if (!['ASSIGNMENT', 'IN_PROGRESS'].includes(project.status)) {
    throw new Error(`No se puede despachar a un proyecto en estado ${project.status}`);
  }
  
  // Transacción para despacho
  const result = await prisma.$transaction(async (tx) => {
    let shouldUpdateToInProgress = false;
    
    if (project.status === 'ASSIGNMENT') {
      shouldUpdateToInProgress = true;
    }
    
    // Procesar cada ítem
    for (const item of data.items) {
      // 1. Crear movimiento de inventario
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          movementType: 'PROJECT_OUT',
          referenceType: 'PROJECT',
          referenceId: data.projectId,
          sourceLocationId: item.sourceLocationId,
        },
      });
      
      // 2. Actualizar stock del producto
      await tx.product.update({
        where: { id: item.productId },
        data: {
          currentStock: {
            decrement: item.quantity,
          },
        },
      });
      
      // 3. Actualizar material del proyecto
      const projectMaterial = await tx.projectMaterial.findUnique({
        where: {
          projectId_productId: {
            projectId: data.projectId,
            productId: item.productId,
          },
        },
      });
      
      if (projectMaterial) {
        await tx.projectMaterial.update({
          where: { id: projectMaterial.id },
          data: {
            quantityDispatched: {
              increment: item.quantity,
            },
          },
        });
      } else {
        // Crear nuevo material si no existe
        await tx.projectMaterial.create({
          data: {
            projectId: data.projectId,
            productId: item.productId,
            quantityRequired: item.quantity,
            quantityDispatched: item.quantity,
            sourceType: 'STOCK',
          },
        });
      }
    }
    
    // 4. Actualizar estado del proyecto si es necesario
    if (shouldUpdateToInProgress) {
      await tx.project.update({
        where: { id: data.projectId },
        data: { status: 'IN_PROGRESS' },
      });
    }
    
    // 5. Verificar si el proyecto está completo
    const materials = await tx.projectMaterial.findMany({
      where: { projectId: data.projectId },
    });
    
    const allDispatched = materials.every(m => 
      Number(m.quantityDispatched) >= Number(m.quantityRequired)
    );
    
    if (allDispatched && shouldUpdateToInProgress) {
      await tx.project.update({
        where: { id: data.projectId },
        data: { status: 'COMPLETED' },
      });
    }
    
    return { success: true };
  });
  
  revalidatePath('/projects');
  revalidatePath('/inventory');
  
  return result;
}

export async function getCalendarEvents(startDate?: Date, endDate?: Date, projectId?: number) {
  const where: any = {};
  
  if (startDate && endDate) {
    where.startDatetime = {
      gte: startDate,
      lte: endDate,
    };
  }
  
  if (projectId) {
    where.projectId = projectId;
  }
  
  return prisma.calendarEvent.findMany({
    where,
    include: {
      project: true,
    },
    orderBy: { startDatetime: 'asc' },
  });
}

export async function createCalendarEvent(data: {
  title: string;
  description?: string;
  startDatetime: string;
  endDatetime?: string;
  colorCode?: string;
  relatedType?: string;
  relatedId?: number;
  projectId?: number;
  ownerId?: number;
  reminderMinutes?: number;
}) {
  const event = await prisma.calendarEvent.create({
    data: {
      ...data,
      startDatetime: new Date(data.startDatetime),
      endDatetime: data.endDatetime ? new Date(data.endDatetime) : null,
      colorCode: data.colorCode || '#3b82f6',
      reminderMinutes: data.reminderMinutes || 60,
    },
  });
  
  revalidatePath('/calendar');
  return event;
}

export async function getFamilies() {
  return prisma.family.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

export async function getPartners(type?: string) {
  const where = type ? { type, isActive: true } : { isActive: true };
  return prisma.partner.findMany({
    where,
    orderBy: { name: 'asc' },
  });
}

export async function getWarehouses() {
  return prisma.warehouse.findMany({
    where: { isActive: true },
    include: {
      locations: {
        where: { isActive: true },
      },
    },
  });
}

export async function getLocations(warehouseId?: number) {
  const where = warehouseId ? { warehouseId, isActive: true } : { isActive: true };
  return prisma.location.findMany({
    where,
    include: {
      warehouse: true,
    },
    orderBy: { fullPath: 'asc' },
  });
}

export async function getMaterialTemplates() {
  return prisma.materialTemplate.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function applyTemplateToProject(templateId: number, projectId: number, scale: number = 1) {
  const template = await prisma.materialTemplate.findUnique({
    where: { id: templateId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  
  if (!template) {
    throw new Error('Plantilla no encontrada');
  }
  
  const result = await prisma.$transaction(async (tx) => {
    for (const item of template.items) {
      const scaledQuantity = Number(item.quantityBase) * scale;
      
      await tx.projectMaterial.upsert({
        where: {
          projectId_productId: {
            projectId,
            productId: item.productId,
          },
        },
        update: {
          quantityRequired: {
            increment: scaledQuantity,
          },
        },
        create: {
          projectId,
          productId: item.productId,
          quantityRequired: scaledQuantity,
          sourceType: 'STOCK',
        },
      });
    }
    
    return { success: true };
  });
  
  revalidatePath('/projects');
  return result;
}
