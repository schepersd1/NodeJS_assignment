import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";

export const getRecipe = async (id: string) => {
	const recipe = await prisma.recipe.findUnique({
		where: { id },
	});

	if (!recipe) {
		throw new NotFoundException("Recipe not found");
	}

	return recipe;
};