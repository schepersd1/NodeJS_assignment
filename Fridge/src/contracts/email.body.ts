import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class EmailBody {
    @IsEmail()
    @ApiProperty()
    public email: string;
}