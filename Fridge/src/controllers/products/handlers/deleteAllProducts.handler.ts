import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { deleteProductFromFridge } from "../../fridges/handlers/deleteProductFromFridge.handler";
import { EmailBody } from "../../../contracts/email.body";

export const deleteAllProducts = async (body: EmailBody) => {
    const products = await prisma.product.findMany({
        where:   {
            owner: body.email,
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
