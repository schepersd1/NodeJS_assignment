import { createRecipe } from "./handlers/create.handler";
import { deleteRecipe } from "./handlers/delete.handler";
import { getRecipe } from "./handlers/get.handler";
import { getRecipeList } from "./handlers/getList.handler";
import { updateRecipe } from "./handlers/update.handler";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserBody } from "../../contracts/user.body";
import { SearchQuery } from "../../contracts/search.query";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RecipeBody } from "../../contracts/recipe.body";


@Controller("recipes")
export class RecipeController {
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createRecipe(@Body() body: RecipeBody) {
		return createRecipe(body);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getRecipeList(@Query() query: SearchQuery) {
		return getRecipeList(query.search);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	async getRecipe(@Param("id") id: string) {
		return getRecipe(id);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard)
	async updateRecipe(
		@Param("id") id: string,
		@Body() body: RecipeBody
	) {
		return updateRecipe(id, body);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async deleteRecipe(@Param("id") id: string): Promise<void> {
		await deleteRecipe(id);
	}
}
