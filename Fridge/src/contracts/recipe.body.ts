import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNumber, isString, IsString, Length } from "class-validator";
import { ProductBody } from "./product.body";
import { ApiProperty } from "@nestjs/swagger";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
class RecipeBody {
	// We can expose the properties we want included one by one
    // @Expose()
    // @IsNumber()
    // public id: string;
    
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
    @ApiProperty()
    public ingredients: ProductBody[];
}

export { RecipeBody };