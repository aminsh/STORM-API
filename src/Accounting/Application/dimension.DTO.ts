import { IsString, IsNotEmpty } from "class-validator";

export abstract class DimensionDTO {
    code: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;
}


export class DimensionCreateDTO extends DimensionDTO {
    @IsNotEmpty()
    categoryId: number;
}

export class DimensionUpdateDTO extends DimensionDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}