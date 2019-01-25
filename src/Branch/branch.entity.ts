import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {BranchMember} from "./branchMember.entity";
import { User } from "../User/user.entity";

@Entity('branches')
export class Branch {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    owner: User;

    @OneToMany(() => BranchMember, BranchMember => BranchMember.branch, {cascade: true})
    members: BranchMember[];
}