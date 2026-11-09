import { z } from 'zod';
export const conversationSchema = z.object({
  contactId: z.string().uuid().optional(),
  channel: z.enum(['chat', 'email', 'whatsapp', 'sms']).default('chat'),
  subject: z.string().optional(),
  status: z.enum(['open', 'pending', 'resolved', 'archived']).optional(),
  assignedTo: z.string().uuid().optional(),
});
export const messageSchema = z.object({
  senderType: z.enum(['user', 'contact', 'agent']),
  senderId: z.string().uuid().optional(),
  content: z.string().min(1),
  attachments: z.array(z.string()).optional(),
});
