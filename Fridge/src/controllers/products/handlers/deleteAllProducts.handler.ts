import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { deleteProductFromFridge } from "../../fridges/handlers/deleteProductFromFridge.handler";

export const deleteAllProducts = async (email: string) => {
    const products = await prisma.product.findMany({
        where:   {
            owner: email,
            fridgeId: {
                not:null,
            }
        },
    });

    for (const product of products) {
        await deleteProductFromFridge(product.id);
    }

    return products;
};
