import {z} from 'zod';

export const schoolSchema = z.object({
    name: z.string().nonempty().max(100),
    city: z.string().max(50),
    programs: z.string(),
    open_house_date: z.date(),
    website: z.string().max(250),
})