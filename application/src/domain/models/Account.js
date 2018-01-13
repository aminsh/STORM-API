import {EntityBase} from "./EntityBase";
import {Column, JoinColumn, OneToMany, OneToOne} from "typeorm";

export class GeneralLedgerAccount extends EntityBase {

    @Column("varchar")
    code = undefined;

    @Column("varchar")
    title = undefined;

    @Column("varchar")
    description = undefined;

    @Column({type: "enum", enum: ['balanceSheet', 'benefitAndLoss', 'entezami']})
    postingType = undefined;

    @Column("varchar")
    groupingType = undefined;

    @Column("boolean")
    isLocked = undefined;

    @OneToMany(type => SubsidiaryLedgerAccount, SubsidiaryLedgerAccount => SubsidiaryLedgerAccount.generalLedgerAccount)
    subsidiaryLedgerAccount = [];
}

export class SubsidiaryLedgerAccount extends EntityBase {

    @Column("varchar")
    code = undefined;

    @Column("varchar")
    title = undefined;

    @Column("varchar")
    description = undefined;

    @Column("boolean")
    isBankAccount = undefined;

    @Column("boolean")
    hasDetailAccount = undefined;

    @Column("boolean")
    hasDimension1 = undefined;

    @Column("boolean")
    hasDimension2 = undefined;

    @Column("boolean")
    hasDimension3 = undefined;

    @OneToOne(type => GeneralLedgerAccount, {eager: true})
    @JoinColumn({name: "generalLedgerAccountId", referencedColumnName: "id"})
    generalLedgerAccount = undefined;

    @Column({type: "enum", enum: ['debtor', 'creditor']})
    balanceType = undefined;

    @Column("varchar")
    groupingType = undefined;

    @Column("boolean")
    isLocked = undefined;
}