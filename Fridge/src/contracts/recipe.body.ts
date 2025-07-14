import { Exclude, Expose } from "class-transformer";
import { IsArray, IsEmail, IsNumber, isString, IsString, Length } from "class-validator";
import { ProductBody } from "./product.body";
import { ApiProperty } from "@nestjs/swagger";
@Exclude()
class RecipeBody {
	@Expose()
	@IsString()
    @ApiProperty()
	public name: string;

    @Expose()
	@IsString()
    @ApiProperty()
	public description: string;

    @Expose()
    @IsEmail()
    @ApiProperty()
    public owner: string;

    @Expose()
    @IsArray()
    @IsString({each: true})
@ApiProperty({type: [String]})
    public ingredients: string[];
}

export { RecipeBody };