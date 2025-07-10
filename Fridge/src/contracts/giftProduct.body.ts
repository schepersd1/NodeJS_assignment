import { IsEmail } from "class-validator";

export class GiftProductBody {
    @IsEmail()
    public from: string;

    @IsEmail()
    public to: string;
}