import { ProductBody } from "../../../contracts/product.body";
import { prisma } from "../../../lib/prisma";

export const createProduct = async (body: ProductBody) => {
	const product = await prisma.product.create({
		data: {
			size: body.size,
			type: body.type,
			owner: body.owner,
		},
	});

	return product;
};