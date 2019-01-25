import { Entity, Column } from "typeorm";
import { BranchSupportEntity } from "../../Infrastructure/Domain/BranchSupportEntity";

@Entity('dimensions')
export class Dimension extends BranchSupportEntity {
    @Column()
    code: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    dimensionCategoryId: number;
}
