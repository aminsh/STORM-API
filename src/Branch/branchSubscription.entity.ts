import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Plan } from "../StormOrder/plan.entity";
import { Branch } from "./branch.entity";

@Entity('branchSubscriptions')
export class BranchSubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    plan: Plan;

    @ManyToOne(() => Branch, Branch => Branch.subscriptions, { onDelete: "RESTRICT" })
    @JoinColumn({ name: 'branchId' })
    branch: Branch;

    @Column()
    isActiveApi: boolean;
}