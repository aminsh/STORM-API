import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class BankCreateDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    bank: string;

    @IsString()
    bankBranch: string;

    @IsString()
    accountNumber: string;

    @IsString()
    bankAccountNumber: string;

    @IsString()
    bankAccountCartNumber: string;
}

export class BankUpdateDTO {
    id: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    bank: string;

    @IsString()
    bankBranch: string;

    @IsString()
    accountNumber: string;

    @IsString()
    bankAccountNumber: string;

    @IsString()
    bankAccountCartNumber: string;
}