import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity, OneToMany} from "typeorm";
import {SubsidiaryLedgerAccount} from "./subsidiaryLedgerAccount.entity";

@Entity('generalLedgerAccounts')
export class GeneralLedgerAccount extends BranchSupportEntity {
    @Column()
    code: string;

    @Column()
    title: string;

    @Column()
    postingType: PostingType;

    @Column()
    groupingType: string;

    @OneToMany(type => SubsidiaryLedgerAccount, SubsidiaryLedgerAccount => SubsidiaryLedgerAccount.generalLedgerAccount)
    subsidiaryLedgerAccounts: Promise<SubsidiaryLedgerAccount[]>
}

export enum PostingType {
    BALANCESHEET = 'balanceSheet',
    BENEFITANDLOSS = 'benefitAndLoss',
    ENTEZAMI = 'entezami'
}