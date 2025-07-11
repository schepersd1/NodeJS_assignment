import { RecipeBody } from "../../../contracts/recipe.body";
import { prisma } from "../../../lib/prisma";

export const createRecipe = async (body: RecipeBody) => {
	const recipe = await prisma.recipe.create({
		data: {
			name: body.name,
			description: body.description,
			owner: body.owner,
			ingredients: {
				create: body.ingredients.map((product) => ({
					id: undefined, // omit, Prisma will connect automatically
					size: product.size,
					type: product.type,
					owner: product.owner,
				})),
			},	
		},
	});

	return recipe;
};