import {BeforeInsert, Column} from "typeorm";
import {BranchSupportEntity} from "./BranchSupportEntity";
import {getCurrentContext} from "../ApplicationCycle";

export class FiscalPeriodSupportEntity extends BranchSupportEntity {

    @Column()
    fiscalPeriodId: string;

    @BeforeInsert()
    protected beforeInsert() {
        super.beforeInsert();

        const context = getCurrentContext();
        this.fiscalPeriodId = context.fiscalPeriodId;
    }
}