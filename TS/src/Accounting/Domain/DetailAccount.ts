import {BranchSupportEntity} from "../../Infrastructure/Domain/BranchSupportEntity";
import {Column, Entity, TableInheritance} from "typeorm";

@Entity('detailAccounts')
@TableInheritance({column: {type: 'varchar', name: 'detailAccountType'}})
export class DetailAccount extends BranchSupportEntity {
    @Column()
    title: string;

    @Column()
    code: string;

    @Column()
    description: string;

    @Column({name: 'referenceId'})
    reference: string;
}