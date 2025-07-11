import { prisma } from "../lib/prisma";

export const validateUser = async (email: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
    where: { email },
  });
  return !!user;
};
