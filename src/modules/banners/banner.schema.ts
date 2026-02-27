import { z } from 'zod'


export const BannerTypeEnum = z.enum(['sales', 'featured', 'new'])

export const BannerSchema = z.object({
    image_url: z.string(),
    link_url: z.string(),
    type: BannerTypeEnum.default('sales'),
    created_at: z.string(),
})
export type BannerInput = z.infer<typeof BannerSchema>