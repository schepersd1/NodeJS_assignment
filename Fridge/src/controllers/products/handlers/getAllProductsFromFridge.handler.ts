import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { validateUser } from "../../../validators/user.validator";

export const getAllProductsFromFridge = async (id: string, email: string) => {
    const validUser = await validateUser(email);
    if (!validUser) {
    throw new BadRequestException("Email is not linked to a valid user");
  }

  const existingFridge = await prisma.fridge.findUnique({
    where: { id },
  });

  if (!existingFridge) {
    throw new NotFoundException("Fridge not found");
  }

  const products = await prisma.product.findMany({
    where: { owner: email, fridgeId: id },
    orderBy: { size: "desc" },
  });

  return products;
};
