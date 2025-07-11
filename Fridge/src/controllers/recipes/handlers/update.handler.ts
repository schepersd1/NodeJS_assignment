import { NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { RecipeBody } from "../../../contracts/recipe.body";

export const updateRecipe = async (id: string, body: Partial<RecipeBody>) => {
	const existingRecipe = await prisma.recipe.findUnique({
		where: { id },
	});

	if (!existingRecipe) {
		throw new NotFoundException("Recipe not found");
	}

	const updateData: any = {};
	if (body.name !== undefined) updateData.name = body.name;
	if (body.description !== undefined) updateData.description = body.description;
	if (body.owner !== undefined) updateData.owner = body.owner;
	if (body.ingredients !== undefined) updateData.ingredients = body.ingredients;
	
	const recipe = prisma.recipe.update({
		where: { id },
		data: updateData,
	});
	return recipe;
};