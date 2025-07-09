import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const deleteRecipe = async (id: string) => {
	const existingRecipe = await prisma.recipe.findUnique({
		where: { id },
	});

	if (!existingRecipe) {
		throw new NotFoundException("Recipe not found");
	}

	await prisma.recipe.delete({
		where: { id },
	});
};