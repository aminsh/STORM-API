import { ChildEntity, Column } from "typeorm";
import { DetailAccount } from "../Accounting/Domain/detailAccount.entity";

@ChildEntity('person')
export class Person extends DetailAccount {
    constructor() {
        super();

        this.contacts = this.contacts || [];
    }

    address: string;
    phone: string;
    mobile: string;
    fax: string;
    email: string;
    nationalCode: string;
    economicCode: string;
    registrationNumber: string;
    province: string;
    city: string;
    postalCode: string;
    contacts: any;
    isMarketer: boolean;
    marketerCommissionRate: number;
    personType: PersonType = PersonType.REAL;
    priceListId: string;
}

export enum PersonType {
    REAL = 'real',
    LEGAL = 'legal'
}