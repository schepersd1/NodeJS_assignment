import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class GiftProductBody {
    @IsEmail()
    @ApiProperty()
    public from: string;

    @IsEmail()
    @ApiProperty()
    public to: string;
}