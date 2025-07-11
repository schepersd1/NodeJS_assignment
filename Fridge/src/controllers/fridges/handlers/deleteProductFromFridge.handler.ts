import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteProductFromFridge = async (id: string) => {
    const existingProduct = await prisma.product.findUnique({
        where: { id },
    });

    if (!existingProduct) {
        throw new NotFoundException("Product not found");
    }

    const linkedFridge = existingProduct.fridgeId;

    if (!linkedFridge) {
        throw new BadRequestException("Product is not in a fridge");
    }
    
	await prisma.product.update({
		where: { id },
		data: {
			fridge: {
				disconnect: true,
			},
		},
	});
};