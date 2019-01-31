import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { BranchMember } from "./branchMember.entity";
import { User } from "../User/user.entity";
import { BranchSubscription } from "./branchSubscription.entity";

@Entity('branches')
export class Branch {
    constructor() {
        this.members = this.members || [];
        this.subscriptions = this.subscriptions || [];
    }

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    owner: User;

    @OneToMany(() => BranchMember, BranchMember => BranchMember.branch, { cascade : true })
    members: BranchMember[];

    @OneToMany(() => BranchSubscription, BranchSubscription => BranchSubscription.branch, { eager : true })
    subscriptions: BranchSubscription[];

    @Column()
    status: BranchStatus;

    isUnlimited: boolean;

    isProtected: boolean;
}

export enum BranchStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    EXPIRED = 'expired'
}