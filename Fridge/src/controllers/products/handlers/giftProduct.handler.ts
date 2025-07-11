import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const giftProduct = async (id: string, body: string) => {
	const existingProduct = await prisma.product.findUnique({
		where: { id },
	});

	if (!existingProduct) {
		throw new NotFoundException("Product not found");
	}

    const updateData: any = {};
	updateData.owner = body;

	const updatedProduct =  prisma.product.update({
        where: { id },
        data: updateData,
	});

	return updatedProduct;
};