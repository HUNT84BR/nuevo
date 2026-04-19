import { z } from 'zod';

export const projectStatusSchema = z.enum([
  'PLANNING',
  'ASSIGNMENT',
  'IN_PROGRESS',
  'PAUSED',
  'COMPLETED',
  'CLOSED',
  'CANCELLED',
]);

export const poStatusSchema = z.enum([
  'REQUESTED',
  'PROCESSING',
  'COMPLETED',
  'CANCELLED',
]);

export const movementTypeSchema = z.enum([
  'PURCHASE_IN',
  'SALE_OUT',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'RETURN_IN',
  'ADJUSTMENT',
  'OPENING_STOCK',
  'PROJECT_OUT',
]);

export const createProjectSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  clientId: z.number().optional(),
  contractorId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().default(0),
});

export const createPurchaseOrderSchema = z.object({
  poNumber: z.string().min(1),
  supplierId: z.number().optional(),
  projectId: z.number().optional(),
  type: z.enum(['GLOBAL', 'PROJECT']),
  lines: z.array(z.object({
    productId: z.number(),
    quantityOrdered: z.number().positive(),
    unitPrice: z.number().default(0),
  })),
});

export const createReceiptBatchSchema = z.object({
  poId: z.number(),
  lines: z.array(z.object({
    poLineId: z.number(),
    quantityPhysical: z.number().positive(),
    locationId: z.number().optional(),
  })),
});

export const dispatchMaterialSchema = z.object({
  projectId: z.number(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().positive(),
    sourceLocationId: z.number(),
  })),
});

export const returnMaterialSchema = z.object({
  projectId: z.number(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().positive(),
    reasonCode: z.string(),
  })),
});

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type POStatus = z.infer<typeof poStatusSchema>;
export type MovementType = z.infer<typeof movementTypeSchema>;
