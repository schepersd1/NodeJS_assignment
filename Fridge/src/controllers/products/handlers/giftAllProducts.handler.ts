import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { GiftProductBody } from "../../../contracts/giftProduct.body";
import { giftProduct } from "./giftProduct.handler";
import { Product } from "@prisma/client";

export const giftAllProducts = async (body: GiftProductBody) => {
    const products = await prisma.product.findMany({
        where:   {
            owner: body.from,
            fridgeId: {
                not:null,
            }
        },
    });

    let updatedProducts: Product[] = [];
    for (const product of products) {
        const updatedProduct = await giftProduct(product.id, body.to);
        updatedProducts.push(updatedProduct);
    }
    
    return updatedProducts;
};
