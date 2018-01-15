import {EntityBase} from "./EntityBase";
import {Column} from "typeorm";

export class FiscalPeriod extends EntityBase {

    @Column("varchar")
    title = undefined;

    @Column("varchar")
    minDate = undefined;

    @Column("varchar")
    maxDate = undefined;

    @Column("boolean")
    isClosed = undefined;
}