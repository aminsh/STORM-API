interface ProductCommand {
    id: string;
    code: string;
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

interface ProductCategoryCommand {
    id: string;
    title: string;
}

interface ScaleCommand {
    id: string;
    title: string;
}


