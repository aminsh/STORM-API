import {Column, Entity, OneToMany} from "typeorm";
import {FiscalPeriodSupportEntity} from "../../Infrastructure/Domain/FiscalPeriodSupportEntity";
import {JournalLine} from "./JournalLine";

@Entity("journals")
export class Journal extends FiscalPeriodSupportEntity {

    constructor() {
        super();

        if (!this.journalLines)
            this.journalLines = [];
    }

    @Column({name: 'temporaryNumber'})
    number: number;

    @Column({name: 'temporaryDate'})
    date: string;

    @Column()
    description: string;

    @Column({name: 'journalStatus'})
    status: JournalStatus = JournalStatus.TEMPORARY;

    @Column({name: 'journalType'})
    type: JournalType;

    @Column()
    isInComplete: boolean;

    @Column()
    attachmentFileName: string;

    @Column()
    fiscalPeriod: any;

    @OneToMany(() => JournalLine, line => line.Journal, {eager: true, cascade: true})
    journalLines: JournalLine[];
}

export enum JournalStatus {
    TEMPORARY, BOOKKEEPED, FIXED
}

export enum JournalType {
    OPENING, CLOSING, FIXEDASSET, PAYROLL, SPECIAL
}