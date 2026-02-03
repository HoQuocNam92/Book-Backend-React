import prisma from "#db";
export const findUserByEmail = (email) => {
  return prisma.users.findUnique({
    where: { email },
  });
};
export const createUser = (data) => {
  return prisma.users.create({
    data,
  });
};
