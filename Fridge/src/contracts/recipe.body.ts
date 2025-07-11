import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNumber, isString, IsString, Length } from "class-validator";
import { ProductBody } from "./product.body";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
class RecipeBody {
	// We can expose the properties we want included one by one
    @Expose()
    @IsNumber()
    public id: string;
    
	@Expose()
	@IsString()
	public name: string;

    @Expose()
	@IsString()
	public description: string;

    @Expose()
    @IsEmail()
    public owner: string;

    @Expose()
    public ingredients: ProductBody[];
}

export { RecipeBody };