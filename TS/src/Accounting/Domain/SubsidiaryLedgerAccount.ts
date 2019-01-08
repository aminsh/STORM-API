import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity} from "typeorm";

@Entity('subsidiaryLedgerAccounts')
export class SubsidiaryLedgerAccount extends BranchSupportEntity {
    @Column()
    code: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    balanceType: BalanceType;

    @Column()
    hasDetailAccount: boolean;

    @Column()
    hasDimension1: boolean;

    @Column()
    hasDimension2: boolean;

    @Column()
    hasDimension3: boolean;
}

export enum BalanceType {
    DEBIT = 'debit',
    CREDIT = 'credit'
}