import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {DetailAccount} from "./DetailAccount";
import {Journal} from "./Journal";

@Entity('journalLines')
export class JournalLine extends BranchSupportEntity {
    @Column()
    row: number;

    generalLedgerAccount: any;
    subsidiaryLedgerAccount: any;

    @ManyToOne(() => DetailAccount, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "detailAccountId"})
    detailAccount: DetailAccount;

    dimension1: any;
    dimension2: any;
    dimension3: any;

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