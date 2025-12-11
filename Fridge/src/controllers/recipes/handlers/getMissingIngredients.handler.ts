import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { getAllProducts } from "../../products/handlers/getAllProducts.handler";
import { validateUser } from "../../../validators/user.validator";

export const getMissingIngredients = async (id: string, email: string) => {
    const validUser = await validateUser(email);
    if (!validUser) {
        throw new BadRequestException("Email is not linked to a valid user");
    }
    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: { ingredients: true}
    });

    if (!recipe) {
        throw new NotFoundException("Recipe not found");
    }

    const currentIngredients = await getAllProducts(email);

    const missingIngredients = recipe.ingredients.filter(
		(recipeIngredient) =>
			!currentIngredients.some(
				(userIngredient) => userIngredient.id === recipeIngredient.id
			)
	);
        
    return missingIngredients;
};