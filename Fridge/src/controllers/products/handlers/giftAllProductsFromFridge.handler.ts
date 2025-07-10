import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { GiftProductBody } from "../../../contracts/giftProduct.body";
import { giftProduct } from "./giftProduct.handler";
import { Product } from "@prisma/client";

export const giftAllProductsFromFridge = async (id: string, body: GiftProductBody) => {
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
		const updatedProduct = await giftProduct(product.id, body.to);
        updatedProducts.push(updatedProduct);
	}

    return updatedProducts;
};
