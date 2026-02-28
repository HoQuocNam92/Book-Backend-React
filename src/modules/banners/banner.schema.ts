import { z } from 'zod'


export const BannerTypeEnum = z.enum(['sales', 'featured', 'new'])

export const BannerSchema = z.object({
    link_url: z.string("Vui lòng nhập URL hợp lệ").url(),
    type: BannerTypeEnum.default('sales'),
})
export type BannerInput = z.infer<typeof BannerSchema>