import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SearchQuery } from "../../contracts/search.query";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RecipeBody } from "../../contracts/recipe.body";
import { ProductBody } from "../../contracts/product.body";
import { putProductInFridge } from "./handlers/putProductInFridge.handler";
import { deleteProductFromFridge } from "./handlers/deleteProductFromFridge.handler";




@Controller("fridges")
export class FridgeController {
	@Patch(":id/put")
	@UseGuards(JwtAuthGuard)
	async putProductInFridge(
		@Param("id") id: string,
		@Body() body: ProductBody
	) {
		return putProductInFridge(id, body);
	}

	@Patch(":id/delete")
	@UseGuards(JwtAuthGuard)
	async deleteProductFromFridge(
		@Param("id") id: string,
	) {
		return deleteProductFromFridge(id);
	}

}
