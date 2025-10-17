import {z} from 'zod';

export const schoolSchema = z.object({
    name: z.string().nonempty().max(120),
    city: z.string().max(60),
    website: z.string().max(255),
    //add program array
})