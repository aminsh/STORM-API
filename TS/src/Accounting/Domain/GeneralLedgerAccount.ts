import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity} from "typeorm";

@Entity('generalLedgerAccounts')
export class GeneralLedgerAccount extends BranchSupportEntity {
    @Column()
    code: string;

    @Column()
    title: string;

    @Column()
    postingType: PostingType;

    @Column()
    groupingType: number;
}

export enum PostingType {
    BALANCESHEET = 'balanceSheet',
    BENEFITANDLOSS = 'benefitAndLoss',
    ENTEZAMI = 'entezami'
}