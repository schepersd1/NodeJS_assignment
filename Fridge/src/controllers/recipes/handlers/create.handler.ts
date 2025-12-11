import { RecipeBody } from "../../../contracts/recipe.body";
import { prisma } from "../../../lib/prisma";

export const createRecipe = async (body: RecipeBody) => {
	const recipe = await prisma.recipe.create({
		data: {
			name: body.name,
			description: body.description,
			owner: body.owner,
			ingredients: {
				connect: body.ingredients.map((product) => ({
					id: product.id,
				})),
			},	
		},
	});

	return recipe;
};