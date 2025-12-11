import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { GiftProductBody } from "../../../contracts/giftProduct.body";
import { giftProduct } from "./giftProduct.handler";
import { Product } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { EmailBody } from "../../../contracts/email.body";
import { validateUser } from "../../../validators/user.validator";

export const giftAllProductsFromFridge = async (id: string, body: GiftProductBody) => {
    const validSender = await validateUser(body.from);
    if (!validSender) {
        throw new BadRequestException("Sender Email is not linked to a valid user");
    }
    const validReceiver = await validateUser(body.to);
    if (!validReceiver) {
        throw new BadRequestException("Receiver Email is not linked to a valid user");
    }

    const existingFridge = await prisma.fridge.findUnique({
        where: { id },
    });
    
    if (!existingFridge) {
        throw new NotFoundException("Fridge not found");
    }
    
    const products = await prisma.product.findMany({
        where:   { owner: body.from, fridgeId: id},
    });

    let updatedProducts: Product[] = [];
    for (const product of products) {
		const updatedProduct = await giftProduct(product.id, plainToInstance(EmailBody, {email: body.to}));
        updatedProducts.push(updatedProduct);
	}

    return updatedProducts;
};
