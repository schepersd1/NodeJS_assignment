import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { deleteProductFromFridge } from "../../fridges/handlers/deleteProductFromFridge.handler";
import { EmailBody } from "../../../contracts/email.body";
import { validateUser } from "../../../validators/user.validator";

export const deleteAllProducts = async (body: EmailBody) => {
    const validUser = await validateUser(body.email);
	if (!validUser) {
        throw new BadRequestException("Email is not linked to a valid user");
    }
    
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
