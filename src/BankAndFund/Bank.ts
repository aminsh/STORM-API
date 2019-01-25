import {DetailAccount} from "../../../oldSource/TS/src/Accounting/Domain/DetailAccount";
import {ChildEntity, Column} from "typeorm";

@ChildEntity('bank')
export class Bank extends DetailAccount {
    @Column()
    accountNumber: string;

    @Column()
    accountCartNumber: string;

    @Column()
    bank: string;

    @Column()
    bankBranch: string;

    @Column()
    bankAccountNumber: string;
}