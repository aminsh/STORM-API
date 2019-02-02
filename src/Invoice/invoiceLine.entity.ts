import { BranchSupportEntity } from "../Infrastructure/Domain/BranchSupportEntity";
import { Entity } from "typeorm";
import { Product } from "../Product/product.entity";

@Entity('invoiceLines')
export class InvoiceLine extends BranchSupportEntity {
    product: Product;
    description: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    vat: number;
    stock: Stock;
}