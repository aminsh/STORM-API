import {EntityBase} from "./EntityBase";
import {Column} from "typeorm";

export class DetailAccount extends EntityBase {

    @Column("varchar")
    code = undefined;

    @Column("varchar")
    referanceId = undefined;

    @Column("varchar")
    title = undefined;

    @Column("varchar")
    description = undefined;

    @Column({type: "enum", enum: ['person', 'bank', 'fund']})
    detailAccountType = undefined;

    @Column("varchar")
    address = undefined;

    @Column("varchar")
    phone = undefined;

    @Column("varchar")
    mobile = undefined;

    @Column("varchar")
    fax = undefined;

    @Column("varchar")
    nationalCode = undefined;

    @Column("varchar")
    economicCode = undefined;

    @Column("varchar")
    registrationNumber = undefined;

    @Column("varchar")
    email = undefined;

    @Column({type: "enum", enum: ['legal', 'real']})
    personType = undefined;

    @Column("varchar")
    province = undefined;

    @Column("varchar")
    city = undefined;

    @Column("varchar")
    postalCode = undefined;

    @Column("varchar")
    bank = undefined;

    @Column("varchar")
    bankBranch = undefined;

    @Column("varchar")
    bankAccountNumber = undefined;

    @Column("varchar")
    accountNumber = undefined;

    @Column("varchar")
    accountCartNumber = undefined;

    @Column("text")
    detailAccountCategoryIds = undefined;

    @Column("json[]")
    contacts = [];
}
