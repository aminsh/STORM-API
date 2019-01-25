import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {GeneralLedgerAccount} from "./generalLedgerAccount.entity";

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

    @ManyToOne(() => GeneralLedgerAccount, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "generalLedgerAccountId"})
    generalLedgerAccount: GeneralLedgerAccount;

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