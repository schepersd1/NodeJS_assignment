import { prisma } from "../../../lib/prisma";

export const getRecipeList = async (search?: string) => {
	const where = search
		? {
				owner: {
					contains: search,
					mode: "insensitive" as const,
				},
		  }
		: {};

	const recipes = await prisma.recipe.findMany({
		where,
		orderBy: { name: "desc" },
	});

	return recipes;
};
