import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {DetailAccount} from "./detailAccount.entity";
import {Journal} from "./Journal.entity";
import {GeneralLedgerAccount} from "./generalLedgerAccount.entity";
import {SubsidiaryLedgerAccount} from "./subsidiaryLedgerAccount.entity";
import { Dimension } from "./dimension.entity";

@Entity('journalLines')
export class JournalLine extends BranchSupportEntity {
    @Column()
    row: number;

    @ManyToOne(() => DetailAccount, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "generalLedgerAccountId"})
    generalLedgerAccount: GeneralLedgerAccount;

    @ManyToOne(() => DetailAccount, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "subsidiaryLedgerAccountId"})
    subsidiaryLedgerAccount: SubsidiaryLedgerAccount;

    @ManyToOne(() => DetailAccount, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "detailAccountId"})
    detailAccount: DetailAccount;

    @ManyToOne(() => Dimension, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "dimension1Id"})
    dimension1: Dimension;

    @ManyToOne(() => Dimension, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "dimension2Id"})
    dimension2: Dimension;

    @ManyToOne(() => Dimension, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "dimension3Id"})
    dimension3: Dimension;

    @Column()
    article: any;

    @Column()
    debtor: number;

    @Column()
    creditor: number;

    @ManyToOne(() => Journal)
    @JoinColumn({
        name: "journalId",
        referencedColumnName: "id"
    })
    Journal: Promise<Journal>;
}