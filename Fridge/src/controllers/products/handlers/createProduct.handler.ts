import { plainToInstance } from "class-transformer";
import { ProductBody } from "../../../contracts/product.body";
import { prisma } from "../../../lib/prisma";
import { ProductView } from "../../../contracts/product.view";

export const createProduct = async (body: ProductBody) => {
	const product = await prisma.product.create({
		data: {
			name: body.name,
			size: body.size,
			type: body.type,
			owner: body.owner,
		},
	});

	return plainToInstance(ProductView,product);
};