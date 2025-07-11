import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { deleteProductFromFridge } from "../../fridges/handlers/deleteProductFromFridge.handler";
import { EmailBody } from "../../../contracts/email.body";

export const deleteAllProductsFromFridge = async (id: string, body: EmailBody) => {
    const existingFridge = await prisma.fridge.findUnique({
        where: { id },
    });
    
    if (!existingFridge) {
        throw new NotFoundException("Fridge not found");
    }
    
    const products = await prisma.product.findMany({
        where:   { owner: body.email, fridgeId: id},
    });

    for (const product of products) {
        await deleteProductFromFridge(product.id);
    }

    return products;
};
