import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { EmailBody } from "../../../contracts/email.body";
import { validateUser } from "../../../validators/user.validator";

export const giftProduct = async (id: string, body: EmailBody) => {
	const validUser = await validateUser(body.email);
	if (!validUser) {
        throw new BadRequestException("Email is not linked to a valid user");
    }

	const existingProduct = await prisma.product.findUnique({
		where: { id },
	});

	if (!existingProduct) {
		throw new NotFoundException("Product not found");
	}

    const updateData: any = {};
	updateData.owner = body.email;

	const updatedProduct =  prisma.product.update({
        where: { id },
        data: updateData,
	});

	return updatedProduct;
};