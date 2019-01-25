import {IsEnum, IsNotEmpty, IsString, MinLength} from "class-validator";
import {PostingType} from "../Domain/generalLedgerAccount.entity";

export class GeneralLedgerAccountCreateDTO {
    @IsString()
    code: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsEnum(PostingType)
    postingType: PostingType;

    @IsString()
    description: string;

    groupingType: string;
}

export class GeneralLedgerAccountUpdateDTO extends GeneralLedgerAccountCreateDTO {
    @IsString()
    @IsNotEmpty()
    id: string;
}