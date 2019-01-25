import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Branch} from "./branch.entity";
import {User} from "../User/user.entity";

@Entity('userInBranches')
export class BranchMember {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, {eager: true, cascade: true})
    @JoinColumn()
    user: User;

    @ManyToOne(() => Branch, Branch => Branch.members, {eager: true})
    @JoinColumn()
    branch: Branch;

    @Column()
    token: string;
}