import {z} from 'zod';

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