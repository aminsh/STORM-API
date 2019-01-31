import {BranchSupportEntity} from "../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity} from "typeorm";

@Entity('fiscalPeriods')
export class FiscalPeriod extends BranchSupportEntity {
    @Column()
    title: string;

    @Column()
    minDate: string;

    @Column()
    maxDate: string;

    @Column()
    isClosed: string;

    isDefault: boolean;
}