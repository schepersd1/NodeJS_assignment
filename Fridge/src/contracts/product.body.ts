import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsString, Length } from "class-validator";
import { ProductTypeEnum } from "../enums/productType.enum";
import { ApiProperty } from "@nestjs/swagger";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
class ProductBody {
    // We can expose the properties we want included one by one
    @Expose()
    @IsNumber()
    public id: string;
    
    @Expose()
	@IsNumber()
    @ApiProperty()
	public size: number;

    @Expose()
    @IsEnum(ProductTypeEnum)
    @ApiProperty({ enum: ProductTypeEnum })
    public type: ProductTypeEnum;

    @Expose()
    // We can start adding validation decorators that specify exactly what we expect from the object we will be validating
    @IsEmail()
    @ApiProperty()
    public owner: string;
}

export { ProductBody };