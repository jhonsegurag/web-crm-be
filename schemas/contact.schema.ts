import { z } from 'zod';
export const contactSchema = z.object({
  type: z.enum(['customer', 'lead', 'supplier']).default('customer'),
  firstName: z.string().min(1), lastName: z.string().optional(),
  email: z.string().email().optional(), phone: z.string().optional(),
  company: z.string().optional(), tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.unknown()).optional(), assignedTo: z.string().uuid().optional(),
});
