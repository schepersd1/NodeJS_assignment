import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const getProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new NotFoundException("Product not found");
    }

    return product;
};