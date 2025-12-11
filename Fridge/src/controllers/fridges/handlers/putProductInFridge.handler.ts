import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { ProductView } from "../../../contracts/product.view";

export const putProductInFridge = async (id: string, body: ProductView) => {
	const existingFridge = await prisma.fridge.findUnique({
		where: { id },
        include: { products: true},
	});

	if (!existingFridge) {
		throw new NotFoundException("Fridge not found");
	}

	let currentCapacity: number;
	currentCapacity = 0;
	for (const product of existingFridge.products) {
		currentCapacity = currentCapacity + product.size
	}
	
    if (currentCapacity + body.size > existingFridge.capacity) {
		throw new BadRequestException("Fridge is full");
	}

	const updatedProduct = await prisma.product.update({
		where: { id: body.id },
		data: {
			fridge: {
				connect: { id },
			},
		},
	});

	return updatedProduct;
};