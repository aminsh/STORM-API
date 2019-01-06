import {Column} from "typeorm";
import {BranchSupportEntity} from "./BranchSupportEntity";

export class FiscalPeriodSupportEntity extends BranchSupportEntity {

    @Column()
    fiscalPeriodId: string
}