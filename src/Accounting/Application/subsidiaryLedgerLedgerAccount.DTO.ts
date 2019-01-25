import {BalanceType} from "../Domain/subsidiaryLedgerAccount.entity";
import {IsBoolean, IsEnum, IsNotEmpty, IsString, MinLength} from "class-validator";

class SubsidiaryLedgerLedgerAccountBaseDTO {
    @IsString()
    @IsNotEmpty()
    code: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    isBankAccount: boolean;

    @IsEnum(BalanceType)
    balanceType: BalanceType;

    @IsBoolean()
    hasDetailAccount: boolean;

    @IsBoolean()
    hasDimension1: boolean;

    @IsBoolean()
    hasDimension2: boolean;

    @IsBoolean()
    hasDimension3: boolean;
}

export class SubsidiaryLedgerLedgerAccountCreateDTO extends SubsidiaryLedgerLedgerAccountBaseDTO {
    @IsString()
    @IsNotEmpty()
    generalLedgerAccountId: string;
}

export class SubsidiaryLedgerLedgerAccountUpdateDTO extends SubsidiaryLedgerLedgerAccountBaseDTO {
    @IsString()
    @IsNotEmpty()
    id: string;
}