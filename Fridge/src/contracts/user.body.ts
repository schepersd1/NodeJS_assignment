//user.body.ts

import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
class UserBody {
	// We can expose the properties we want included one by one
	@Expose()
	@IsString()
	@ApiProperty()
	public firstName: string;

	@Expose()
	@IsString()
	@ApiProperty()
	public lastName: string;

	@Expose()
	// We can start adding validation decorators that specify exactly what we expect from the object we will be validating
	@IsEmail()
	@ApiProperty()
	public email: string;

	@Expose()
	@IsString()
	@Length(8)
	@ApiProperty()
	public password: string;
}

export { UserBody };