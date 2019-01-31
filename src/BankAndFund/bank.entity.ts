import {ChildEntity, Column} from "typeorm";
import { DetailAccount } from "../Accounting/Domain/detailAccount.entity";

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