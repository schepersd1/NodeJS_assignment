import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { deleteProductFromFridge } from "../../fridges/handlers/deleteProductFromFridge.handler";
import { EmailBody } from "../../../contracts/email.body";
import { validateUser } from "../../../validators/user.validator";

export const deleteAllProductsFromFridge = async (id: string, body: EmailBody) => {
    const validUser = await validateUser(body.email);
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
        where:   { owner: body.email, fridgeId: id},
    });

    for (const product of products) {
        await deleteProductFromFridge(product.id);
    }

    return products;
};
