import { IsEmail } from "class-validator";

export class EmailBody {
    @IsEmail()
    public email: string;
}