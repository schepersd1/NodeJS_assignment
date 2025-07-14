import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsString, Length } from "class-validator";
import { ProductTypeEnum } from "../enums/productType.enum";
import { ApiProperty } from "@nestjs/swagger";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
class ProductView {
    // We can expose the properties we want included one by one
    @Expose()
    @IsString()
    @ApiProperty()
    public id: string;

    @Expose()
    @IsString()
    @ApiProperty()
    public name: string;
    
    @Expose()
    @IsNumber()
    @ApiProperty()
    public size: number;

    @Expose()
    @IsEnum(ProductTypeEnum)
    @ApiProperty({ enum: ProductTypeEnum })
    public type: ProductTypeEnum;

    @Expose()
    @IsEmail()
    @ApiProperty()
    public owner: string;
}

export { ProductView };