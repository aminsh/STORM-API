import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class AccountCategoryCreateDTO {
    @IsString()
    code: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;
}

export class AccountCategoryUpdateDTO extends AccountCategoryCreateDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}