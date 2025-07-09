import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import { create } from "./handlers/create.handler";
import { deleteUser } from "./handlers/delete.handler";
import { get } from "./handlers/get.handler";
import { getList } from "./handlers/getList.handler";
import { update } from "./handlers/update.handler";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserBody } from "../../contracts/user.body";
import { SearchQuery } from "../../contracts/search.query";
import { UserView } from "../../contracts/user.view";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiSecurity,
} from "@nestjs/swagger";

@ApiTags("users")
@Controller("users")
export class UserController {
	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: "Create a new user" })
	@ApiResponse({ status: 201, description: "User created successfully" })
	async create(@Body() body: UserBody): Promise<UserView> {
		return create(body);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiSecurity("x-auth")
	@ApiOperation({ summary: "Get all users" })
	@ApiResponse({ status: 200, description: "Users retrieved successfully" })
	async getList(@Query() query: SearchQuery): Promise<(number | UserView[])[]> {
		return getList(query.search);
	}

	@Get(":id")
	@UseGuards(JwtAuthGuard)
	async get(@Param("id") id: string): Promise<UserView> {
		return get(id);
	}

	@Patch(":id")
	@UseGuards(JwtAuthGuard)
	async update(
		@Param("id") id: string,
		@Body() body: UserBody
	): Promise<UserView> {
		return update(id, body);
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param("id") id: string): Promise<void> {
		await deleteUser(id);
	}
}
