import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { putProductInFridge } from "./handlers/putProductInFridge.handler";
import { deleteProductFromFridge } from "./handlers/deleteProductFromFridge.handler";
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ProductView } from "../../contracts/product.view";



@ApiTags("fridges")
@Controller("fridges")
export class FridgeController {
	@Patch(":id/put")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Put a product in a fridge" })
	@ApiResponse({ status: 200, description: "Product added to fridge successfully" })
	async putProductInFridge(
		@Param("id") id: string,
		@Body() body: ProductView
	) {
		return putProductInFridge(id, body);
	}

	@Patch(":id/delete")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Remove product from a fridge" })
	@ApiResponse({ status: 200, description: "Product removed from fridge successfully" })
	async deleteProductFromFridge(
		@Param("id") id: string,
	) {
		return deleteProductFromFridge(id);
	}

}
