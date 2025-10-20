import { z } from 'zod';

export const programSchema = z.object({
  name: z.string().nonempty(),
  category: z.string().max(50).optional(),
  description: z.string().max(255).optional()
});

export const updateProgramSchema = z.object({
  name: z.string().nonempty(),
  category: z.string().max(50).optional(),
  description: z.string().max(255).optional()
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number")
});
