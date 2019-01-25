import { Column, Entity } from "typeorm";
import { BranchSupportEntity } from "../Infrastructure/Domain/BranchSupportEntity";

@Entity("scales")
export class Scale extends BranchSupportEntity {
    @Column()
    title: string;
}
