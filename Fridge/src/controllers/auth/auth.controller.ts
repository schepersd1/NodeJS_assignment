import { Controller, Post, Body } from "@nestjs/common";

import { AccessTokenView } from "../../contracts/accessToken.view";
import { LoginBody } from "../../contracts/login.body";
import { createToken } from "./handlers/login.handler";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	@Post("login")
	@ApiOperation({ summary: "Login used to create token for a user" })
	@ApiResponse({ status: 200, description: "Token created successfully" })
	async login(@Body() body: LoginBody): Promise<AccessTokenView> {
		return createToken(body);
	}
}