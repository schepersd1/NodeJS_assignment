import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { giftProduct } from "./handlers/giftProduct.handler";
import { getProduct } from "./handlers/getProduct.handler";
import { getAllProductsFromFridge } from "./handlers/getAllProductsFromFridge.handler";
import { giftAllProductsFromFridge } from "./handlers/giftAllProductsFromFridge.handler";
import { GiftProductBody } from "../../contracts/giftProduct.body";
import { deleteAllProductsFromFridge } from "./handlers/deleteAllProductsFromFridge.handler";
import { getAllProducts } from "./handlers/getAllProducts.handler";
import { giftAllProducts } from "./handlers/giftAllProducts.handler";
import { deleteAllProducts } from "./handlers/deleteAllProducts.handler";
import { getAllProductsLocation } from "./handlers/getAllProductsLocation.handler";
import { createProduct } from "./handlers/createProduct.handler";
import { ProductBody } from "../../contracts/product.body";
import { EmailBody } from "../../contracts/email.body";
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";

@ApiTags("products")
@Controller("products")
export class ProductController {
	@Post()
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.CREATED)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Create a new product" })
	@ApiResponse({ status: 201, description: "Product created successfully" })
	async createProduct(@Body() body: ProductBody) {
		return createProduct(body);
	}

	@Patch(":id/gift")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Gift a product to another user" })
	@ApiResponse({ status: 200, description: "Product gifted successfully" })
	async putProductInFridge(
		@Param("id") id: string,
		@Body() body: EmailBody
	) {
		return giftProduct(id, body);
	}

	@Patch(":id/gift-all-from-fridge")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Gift all their products from a fridge to another user" })
	@ApiResponse({ status: 200, description: "Products gifted successfully" })
	async giftAllProductsFromFridge(
		@Param("id") id: string,
		@Body() body: GiftProductBody
	) {
		return giftAllProductsFromFridge(id, body);
	}

	@Patch("gift-all")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Gift all their products from all fridges to another user" })
	@ApiResponse({ status: 200, description: "Products gifted successfully" })
	async giftAllProducts(
		@Body() body: GiftProductBody
	) {
		return giftAllProducts(body);
	}


	@Patch(":id/delete-all-from-fridge")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Delete all products from a user from a fridge" })
	@ApiResponse({ status: 200, description: "Products deleted successfully" })
	async deleteAllProductsFromFridge(
		@Param("id") id: string,
		@Body() email: EmailBody
	) {
		return deleteAllProductsFromFridge(id, email);
	}	

	@Patch("delete-all")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Delete all products from a user from all fridges" })
	@ApiResponse({ status: 200, description: "Products deleted successfully" })
	async deleteAllProducts(
		@Body() email: EmailBody
	) {
		return deleteAllProducts(email);
	}	

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get all products from a user from all fridges" })
	@ApiResponse({ status: 200, description: "Products retrieved successfully" })
	async getAllProducts(@Query("email") email: string) {
		return getAllProducts(email);
	}

	@Get(":id/all-from-fridge")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get all products from a user from a fridge" })
	@ApiResponse({ status: 200, description: "Products retrieved successfully" })
	async getAllProductsFromFridge(
		@Param("id") id: string, 
		@Query("email") email: string
	) {
		return getAllProductsFromFridge(id, email);
	}

	@Get(":location/all-from-fridge-in-location")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get all products from a user from all fridges in a certain location" })
	@ApiResponse({ status: 200, description: "Products retrieved successfully" })
	async getAllProductsLocation(
		@Param("location",ParseIntPipe) location: number, 
		@Query("email") email: string
	) {
		return getAllProductsLocation(location, email);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get a specific product" })
	@ApiResponse({ status: 200, description: "Product retrieved successfully" })
	async getProduct(@Param("id") id: string) {
		return getProduct(id);
	}
}
