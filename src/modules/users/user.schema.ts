import { z } from 'zod'



export const userProfileSchema = z.object({
    name: z.string("Tên không được để trống"),
    phone: z.string().optional(),
    gender: z.string().optional(),
    birth: z.string().optional(),
})


export type UserProfileInput = z.infer<typeof userProfileSchema>