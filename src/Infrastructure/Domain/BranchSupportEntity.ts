import {BeforeInsert, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {getCurrentContext} from "../ApplicationCycle";
import {Guid} from "../Utility";

export class BranchSupportEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({readonly: true})
    branchId: string;

    @Column({readonly: true})
    createdById: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    protected beforeInsert() {
        const context = getCurrentContext();
        this.id = Guid.create();
        this.branchId = context.branchId;
        this.createdById = context.user.id;
    }
}