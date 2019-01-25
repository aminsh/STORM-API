import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class ProductCreateDTO {

    code: string;

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    title: string;

    productType: string;
    reorderPoint: number;
    salePrice: number;
    categoryId: string;
    scaleId: string;
    referenceId: string;
    barcode: string;
    accountId: string
}

export class ProductUpdateDTO extends ProductCreateDTO {
    id: string;
}