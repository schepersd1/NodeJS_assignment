import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const getAllProductsFromFridge = async (id: string, email: string) => {
        const existingFridge = await prisma.fridge.findUnique({
            where: { id },
        });
    
        if (!existingFridge) {
            throw new NotFoundException("Fridge not found");
        }
    
    const products = await prisma.product.findMany({
        where:   { owner: email, fridgeId: id},
        orderBy: { size: "desc" },
    });

    return products;
};
