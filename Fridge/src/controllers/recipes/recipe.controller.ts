import { createRecipe } from "./handlers/create.handler";
import { deleteRecipe } from "./handlers/delete.handler";
import { getRecipe } from "./handlers/get.handler";
import { getRecipeList } from "./handlers/getList.handler";
import { updateRecipe } from "./handlers/update.handler";
import { getMissingIngredients } from "./handlers/getMissingIngredients.handler";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SearchQuery } from "../../contracts/search.query";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RecipeBody } from "../../contracts/recipe.body";
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { getRecipeSuggestions } from "./handlers/getRecipeSuggestions.handler";

@ApiTags("recipes")
@Controller("recipes")
export class RecipeController {
	@Post()
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.CREATED)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Create a new recipe" })
	@ApiResponse({ status: 201, description: "Users retrieved successfully" })
	async createRecipe(@Body() body: RecipeBody) {
		return createRecipe(body);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get all recipes from user" })
	@ApiResponse({ status: 200, description: "Recipes retrieved successfully" })
	async getRecipeList(@Query() query: SearchQuery) {
		return getRecipeList(query.search);
	}

	@Get(":id/missing-ingredients")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get missing ingredients to complete a recipe, based on the products that they have stored across fridges" })
	@ApiResponse({ status: 200, description: "Ingredients retrieved successfully" })
	async getMissingIngredients(
		@Param("id") id: string, 
		@Query("email") email: string
	) {
		return getMissingIngredients(id, email);
	}

	@Get(":email/recipe-suggestions")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get recipe suggestions, based on the products that they have stored across fridges" })
	@ApiResponse({ status: 200, description: "Recipe retrieved successfully" })
	async getRecipeSuggestions(
		@Param("email") email: string, 
	) {
		return getRecipeSuggestions(email);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get a specific recipe" })
	@ApiResponse({ status: 200, description: "Recipe retrieved successfully" })
	async getRecipe(@Param("id") id: string) {
		return getRecipe(id);
	}
	
	@Patch(":id")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Update a specific recipe" })
	@ApiResponse({ status: 200, description: "Recipe updated successfully" })
	async updateRecipe(
		@Param("id") id: string,
		@Body() body: RecipeBody
	) {
		return updateRecipe(id, body);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Delete a specific recipe" })
	@ApiResponse({ status: 204, description: "Recipe deleted successfully" })
	async deleteRecipe(@Param("id") id: string): Promise<void> {
		await deleteRecipe(id);
	}
}
