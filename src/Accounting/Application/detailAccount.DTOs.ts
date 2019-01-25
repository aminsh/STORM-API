import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class DetailAccountCreateDTO {
    @IsString()
    code: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    description: string;

    referenceId: string;
}

export class DetailAccountUpdateDTO extends DetailAccountCreateDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}