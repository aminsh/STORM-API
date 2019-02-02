import { ChildEntity } from "typeorm";
import { Person } from "../Person/person.entity";
import { InvoiceBase } from "../Invoice/invoice.entity";

@ChildEntity('sale')
export class Sale extends InvoiceBase {
    customer: Person;
    marketer: Person;
}