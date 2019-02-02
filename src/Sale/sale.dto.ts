export class SaleCreateDTO {
    date?: string;
    number?: string;
    description?: string;
    title?: string;
    customer: CustomerDTO;
    marketerId?: string;
    orderId?: string;
    costs?: { [ key: string ]: number };
    charges?: { [ key: string ]: number };
    discount?: number;
    invoiceLines: SaleLine[]
}

export class SaleUpdateDTO extends SaleCreateDTO {
    id: string;
}

export class SaleLine {
    product: ProductDTO;
    description?: string;
    stockId: string;
    quantity: string;
    unitPrice: number;
    discount: number;
    vat: number;
    tax: number;
}

export class CustomerDTO {
    id: string;
    referenceId: string;
    title: string;
}

export class ProductDTO {
    id: string;
    referenceId: string;
    title: string;
}




