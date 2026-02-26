import { z } from 'zod'

export const adddressSchema = z.object({
    address: z.string().min(1, "Địa chỉ không được để trống"),
    phone: z.string().min(1, "Số điện thoại không được để trống").regex(/^\d+$/, "Số điện thoại phải là số"),
    province_code: z.number().min(1, "ID tỉnh thành không được để trống"),
    district_code: z.number().min(1, "ID quận/huyện không được để trống"),
    ward_code: z.number().min(1, "ID phường/xã không được để trống"),
})





export type AddressInput = z.infer<typeof adddressSchema>