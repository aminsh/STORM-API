import { PersonType } from "./person.entity";

export class PersonCreateDTO {
    code: string;
    title: string;
    referenceId?: string;
    address?: string;
    postalCode?: string;
    province?: string;
    city?: string;
    phone?: string;
    mobile?: string;
    fax?: string;
    personType?: PersonType;
    economicCode?: string;
    registrationNumber?: string;
    nationalCode?: string;
    contacts?: any[];
    isMarketer?: boolean;
    marketerCommissionRate?: number;
    priceListId: string;
}

export class PersonUpdateDTO extends PersonCreateDTO {
    id: string;
}

