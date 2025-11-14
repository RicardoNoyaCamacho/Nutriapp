import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreatePatientDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    // (YYYY-MM-DD)
    @IsDateString()
    birthdayDate?: Date;

    @IsOptional()
    @IsString()
    phone?: string;



}
