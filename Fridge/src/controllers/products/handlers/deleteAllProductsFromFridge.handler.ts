import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { deleteProductFromFridge } from "../../fridges/handlers/deleteProductFromFridge.handler";

export const deleteAllProductsFromFridge = async (id: string, email: string) => {
    const existingFridge = await prisma.fridge.findUnique({
        where: { id },
    });
    
    if (!existingFridge) {
        throw new NotFoundException("Fridge not found");
    }
    
    const products = await prisma.product.findMany({
        where:   { owner: email, fridgeId: id},
    });

    for (const product of products) {
        await deleteProductFromFridge(product.id);
    }

    return products;
};
