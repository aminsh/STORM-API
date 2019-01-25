import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity} from "typeorm";

@Entity('accountCategories')
export class AccountCategory extends BranchSupportEntity {
    @Column({name: 'key'})
    code: string;

    @Column({name: 'display'})
    title: string;
}