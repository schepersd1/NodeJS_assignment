import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { plainToInstance } from "class-transformer";
import { UserView } from "../../../contracts/user.view";

export const get = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: { id },
	});

	if (!user) {
		throw new NotFoundException("User not found");
	}

	return plainToInstance(UserView,user);
};