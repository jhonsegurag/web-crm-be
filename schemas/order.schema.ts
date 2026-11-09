import { z } from 'zod';
export const orderSchema = z.object({ contactId: z.string().uuid().optional(), tableId: z.string().uuid().optional(), locationId: z.string().uuid().optional(), channel: z.enum(['in_store', 'online', 'phone', 'app']).default('in_store'), notes: z.string().optional() });
export const orderItemSchema = z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).default(1), notes: z.string().optional() });
export const orderStatusSchema = z.object({ status: z.enum(['draft', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled', 'refunded']) });
