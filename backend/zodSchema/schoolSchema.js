import {z} from 'zod';

export const listQuerySchema = z.object({
  city: z.string().max(60).optional(),
}).strict();

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
}).strict();

export const schoolCreateSchema = z.object({
  name: z.string().nonempty().max(120),
  city: z.string().max(60).optional(),
  website: z.string().url().optional(),
  image_url: z.string().url().optional(),
  student_count: z.number().int().positive().optional(),
  merit_value: z.number().min(0).max(400).optional(),  // Swedish meritvärde range
  description: z.string().max(1000).optional(),
  programIds: z.array(z.coerce.number().int().positive()).optional(),
}).strict();

export const schoolUpdateSchema = z.object({
  name: z.string().nonempty().max(120).optional(),
  city: z.string().max(60).optional(),
  website: z.string().url().optional(),
  image_url: z.string().url().optional(),
  student_count: z.number().int().positive().optional(),
  merit_value: z.number().min(0).max(400).optional(),
  description: z.string().max(1000).optional(),
  programIds: z.array(z.coerce.number().int().positive()).optional(),
}).strict();

export const schoolSchema = z.object({
    name: z.string().nonempty().max(120),
    city: z.string().max(60).optional(),
    website: z.url().optional(),
    programIds: z.array(z.number()).optional()
})

export const updateSchoolSchema = z.object({
    name: z.string().nonempty().max(120).optional(),
    city: z.string().max(60).optional(),
    website: z.url().optional(),
    programIds: z.array(z.number()).optional()
})