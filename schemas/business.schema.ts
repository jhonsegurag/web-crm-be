import { z } from 'zod';
export const businessSchema = z.object({ name: z.string().min(1).optional(), logoUrl: z.string().optional(), timezone: z.string().optional(), currency: z.string().optional(), plan: z.enum(['free', 'starter', 'pro', 'enterprise']).optional(), settings: z.record(z.string(), z.unknown()).optional() });
export const locationSchema = z.object({ name: z.string().min(1), address: z.string().optional(), city: z.string().optional(), country: z.string().optional(), phone: z.string().optional(), isPrimary: z.boolean().default(false) });
