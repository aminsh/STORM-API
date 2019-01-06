import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity} from "typeorm";

@Entity('accountCategories')
export class AccountCategory extends BranchSupportEntity {
    @Column()
    key: number;

    @Column()
    display: string;
}