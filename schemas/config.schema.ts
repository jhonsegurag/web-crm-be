import { z } from 'zod';
export const userConfigSchema = z.object({ email: z.string().email(), password: z.string().min(6).optional(), roleId: z.string().uuid().optional(), isActive: z.boolean().optional() });
export const roleSchema = z.object({ name: z.string().min(1), permissions: z.array(z.string()).default([]) });
export const integrationSchema = z.object({ type: z.enum(['stripe', 'mailchimp', 'slack', 'zapier', 'twilio', 'custom']), name: z.string().min(1), isActive: z.boolean().default(false), credentials: z.record(z.string(), z.unknown()).optional(), settings: z.record(z.string(), z.unknown()).optional() });
