import {IsNotEmpty, IsString, Length} from "class-validator";
import {IsLongerThan} from "../Infrastructure/Validator/Custom.Validator.IsLognerThan";

export class FiscalPeriodCreateDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 8)
    minDate: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 8)
    @IsLongerThan('minDate')
    maxDate: string;
}

export class FiscalPeriodUpdateDTO extends FiscalPeriodCreateDTO {
    @IsString()
    @IsNotEmpty()
    id: string;
}