import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
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


@Controller("products")
export class ProductController {
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createProduct(@Body() body: ProductBody) {
		return createProduct(body);
	}

	@Patch(":id/gift")
	@UseGuards(JwtAuthGuard)
	async putProductInFridge(
		@Param("id") id: string,
		@Body() body: string
	) {
		return giftProduct(id, body);
	}

	@Patch(":id/gift-all-from-fridge")
	@UseGuards(JwtAuthGuard)
	async giftAllProductsFromFridge(
		@Param("id") id: string,
		@Body() body: GiftProductBody
	) {
		return giftAllProductsFromFridge(id, body);
	}

	@Patch("gift-all")
	@UseGuards(JwtAuthGuard)
	async giftAllProducts(
		@Body() body: GiftProductBody
	) {
		return giftAllProducts(body);
	}


	@Patch(":id/delete-all-from-fridge")
	@UseGuards(JwtAuthGuard)
	async deleteAllProductsFromFridge(
		@Param("id") id: string,
		@Body() email: string
	) {
		return deleteAllProductsFromFridge(id, email);
	}	

	@Patch("delete-all")
	@UseGuards(JwtAuthGuard)
	async deleteAllProducts(
		@Body() email: string
	) {
		return deleteAllProducts(email);
	}	

	@Get()
	@UseGuards(JwtAuthGuard)
	async getAllProducts(@Query("email") email: string) {
		return getAllProducts(email);
	}

	@Get(":id/all-from-fridge")
	@UseGuards(JwtAuthGuard)
	async getAllProductsFromFridge(
		@Param("id") id: string, 
		@Query("email") email: string
	) {
		return getAllProductsFromFridge(id, email);
	}

	@Get(":location/all-from-fridge-in-location")
	@UseGuards(JwtAuthGuard)
	async getAllProductsLocation(
		@Param("location") location: number, 
		@Query("email") email: string
	) {
		return getAllProductsLocation(location, email);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	async getProduct(@Param("id") id: string) {
		return getProduct(id);
	}
}
