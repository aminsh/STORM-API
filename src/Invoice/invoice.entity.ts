import { BranchSupportEntity } from "../Infrastructure/Domain/BranchSupportEntity";
import { Entity, TableInheritance } from "typeorm";
import { InvoiceLine } from "./invoiceLine.entity";

@Entity('invoices')
@TableInheritance({ column: { type: 'varchar', name: 'invoiceType' } })
export class InvoiceBase extends BranchSupportEntity {
    constructor() {
        super();
        this.lines = this.lines || [];
    }

    number: string;
    date: string;
    title: string;
    description: string;
    reference: string;
    journal: string;
    status: InvoiceStatus;
    orderId: string;
    inventoryIds: string[];
    costs: InvoiceCost[];
    charges: InvoiceCharge[];
    discount: number;

    lines: InvoiceLine[]
}

export enum InvoiceStatus {
    DRAFT = 'draft',
    CONFIRMED = 'confirmed',
    FIXED = 'fixed'
}

export interface InvoiceCost {
    key: string;
    value: number;
}

export interface InvoiceCharge extends InvoiceCost {

}