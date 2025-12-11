import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { UserBody } from "../../../contracts/user.body";
import { plainToInstance } from "class-transformer";
import { UserView } from "../../../contracts/user.view";

export const update = async (id: string, body: Partial<UserBody>) => {
	const existingUser = await prisma.user.findUnique({
		where: { id },
	});

	if (!existingUser) {
		throw new NotFoundException("User not found");
	}

	const updateData: any = {};
	if (body.firstName !== undefined) updateData.name = body.firstName;
	if (body.lastName !== undefined) updateData.name = body.lastName;
	if (body.email !== undefined) updateData.email = body.email;
	if (body.password !== undefined) {
		updateData.password = await bcrypt.hash(body.password, 10);
	}
	const user = prisma.user.update({
		where: { id },
		data: updateData,
	});
	return plainToInstance(UserView,user);
};