import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { GiftProductBody } from "../../../contracts/giftProduct.body";
import { giftProduct } from "./giftProduct.handler";
import { Product } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import { EmailBody } from "../../../contracts/email.body";

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
        const updatedProduct = await giftProduct(product.id, plainToInstance(EmailBody, {email: body.to}));
        updatedProducts.push(updatedProduct);
    }
    
    return updatedProducts;
};
