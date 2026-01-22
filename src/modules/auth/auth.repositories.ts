import prisma from '#db'
import { Prisma } from '@prisma/client'

export const findUserByEmail = (email: string) => {
    return prisma.users.findUnique({
        where: { email }
    })
}

export const createUser = (data: Prisma.UsersCreateInput) => {
    return prisma.users.create({
        data
    })
}
