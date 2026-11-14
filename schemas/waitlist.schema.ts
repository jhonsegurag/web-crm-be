import { z } from 'zod';

export const waitlistJoinSchema = z.object({
  email:   z.string().email(),
  name:    z.string().min(1).optional(),
  company: z.string().min(1).optional(),
});
