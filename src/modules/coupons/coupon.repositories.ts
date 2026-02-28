import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createCoupon = async (data: Prisma.CouponsCreateInput) => {
    return await prisma.coupons.create({
        data
    });
};

export const getAllCoupons = async () => {
    return await prisma.coupons.findMany({
        orderBy: { id: 'desc' }
    });
};

export const getCouponById = async (id: number) => {
    return await prisma.coupons.findUnique({
        where: { id }
    });
};

export const getCouponByCode = async (code: string) => {
    return await prisma.coupons.findUnique({
        where: { code }
    });
};

export const updateCoupon = async (id: number, data: Prisma.CouponsUpdateInput) => {
    return await prisma.coupons.update({
        where: { id },
        data
    });
};

export const deleteCoupon = async (id: number) => {
    return await prisma.coupons.delete({
        where: { id }
    });
};
