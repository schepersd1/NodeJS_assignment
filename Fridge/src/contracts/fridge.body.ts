import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNumber, IsString, Length } from "class-validator";
import { ProductBody } from "./product.body";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
class FridgeBody {
	// We can expose the properties we want included one by one
    @Expose()
    @IsNumber()
    public id: number;
    
	@Expose()
	@IsNumber()
	public location: number;

    @Expose()
	@IsNumber()
	public capacity: number;

    @Expose()
    public products: ProductBody[];
}

export { FridgeBody };