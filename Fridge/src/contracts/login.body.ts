import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginBody {
	@IsEmail()
	@ApiProperty()
	public email: string;

	@IsString()
	@ApiProperty()
	public password: string;
}