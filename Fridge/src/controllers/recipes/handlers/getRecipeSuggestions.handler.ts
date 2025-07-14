import { BadRequestException, NotFoundException } from "@nestjs/common";
import { prisma } from "../../../lib/prisma";
import { getAllProducts } from "../../products/handlers/getAllProducts.handler";
import { validateUser } from "../../../validators/user.validator";
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

export const getRecipeSuggestions = async (email: string) => {
    const validUser = await validateUser(email);
    if (!validUser) {
        throw new BadRequestException("Email is not linked to a valid user");
    }
    const currentIngredients = await getAllProducts(email);

    const ingredientsList = currentIngredients.map((item) => `${item.name} (${item.type || 'unknown type'})`).join(', ');

    const recipeSchema = z.object({
        name: z.string(),
        description: z.string(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            amount: z.string(),
          }),
        ),
      });
      
      const result = await generateObject({
        model: anthropic('claude-4-opus-20250514'),
        schema: recipeSchema,
        prompt: `Generate a recipe based on the following products: ${ingredientsList}`,
      });

      console.log(JSON.stringify(result.object, null, 2));

        
    return result;
};