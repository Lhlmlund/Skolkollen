import {z} from 'prisma'

export const programSchema = {
    name: z.string().nonempty(),
    category: z.string().max(50).optional(),
    description: z.string().max().optional()
}

export const updateProgramSchema = {
    name: z.string().nonempty(),
    category: z.string().max(50).optional(),
    description: z.string().optional()
}