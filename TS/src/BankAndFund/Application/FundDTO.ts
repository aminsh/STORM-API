import {IsNotEmpty, IsString} from "class-validator";

export class FundCreateDTO {

    @IsString()
    @IsNotEmpty()
    title: string;
}

export class FundUpdateDTO {
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string;
}