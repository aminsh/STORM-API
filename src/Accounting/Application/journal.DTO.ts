import {ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsString, Length, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class JournalCreateDTO {

    number: number;

    @IsString()
    @Length(10, 10)
    date: string;

    @IsString()
    description: string;

    @IsString()
    attachmentFileName: string;

    @Type(() => JournalLineDTO)
    @ValidateNested()
    @IsArray()
    @IsNotEmpty()
    journalLines: JournalLineDTO[];
}

export class JournalLineDTO {
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty()
    subsidiaryLedgerAccountId: string;

    @IsString()
    detailAccountId: string;

    @IsString()
    dimension1Id: string;

    @IsString()
    dimension2Id: string;

    @IsString()
    dimension3Id: string;

    @IsString()
    article: string;

    @IsNotEmpty()
    debtor: number;

    @IsNotEmpty()
    creditor: number;
}

export class JournalUpdateDTO extends JournalCreateDTO {
    @IsString()
    @IsNotEmpty()
    id: string;
}

export class JournalMergeDTO {
    @IsNotEmpty()
    @IsArray()
    @ArrayNotEmpty()
    ids: string[];

    @IsBoolean()
    shouldConcatDescriptions: boolean;

    @IsString()
    description: string;
}
