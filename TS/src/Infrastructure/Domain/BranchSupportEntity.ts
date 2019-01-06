import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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
}