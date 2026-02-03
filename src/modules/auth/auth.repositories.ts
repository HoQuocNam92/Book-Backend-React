import prisma from '../../utils/prisma';
import type { Prisma } from '@prisma/client';
import { passwordInput } from './auth.schema';

export const findUserByEmail = (email: string) => {
  return prisma.users.findUnique({
    where: { email },
    include: {
      UserRoles: {
        include: {
          Roles: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export const createUser = (data: Prisma.UsersCreateInput) => {
  return prisma.users.create({
    data,
  });
};

export const addTokenToResetPassword = (
  data: Prisma.ResetPasswordCreateInput,
) => {
  return prisma.resetPassword.create({
    data,
  });
};

export const getResetPassword = (user_id: number) => {
  return prisma.resetPassword.findFirst({ where: { user_id: user_id } });
};
export const updateResetPassword = (user_id: number) => {
  return prisma.resetPassword.updateMany({ where: { user_id }, data: { is_used: true } });
};

export const updatePassword = (id: number, password: passwordInput) => {
  return prisma.users.update({ where: { id: id as number }, data: password });
};

export const addRefreshTokens = (
  data: Prisma.RefreshTokensUncheckedCreateInput,
) => {
  return prisma.refreshTokens.create({ data });
};

export const getRefreshTokens = (id: number) => {
  return prisma.refreshTokens.findFirst({ where: { Id: id } });
};
