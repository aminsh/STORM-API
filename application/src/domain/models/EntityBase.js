import {Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

export class EntityBase {

    @PrimaryColumn({type: 'varchar'})
    id = undefined;

    @Column({type: 'varchar'})
    branchId = undefined;

    @CreateDateColumn()
    createdAt = undefined;

    @UpdateDateColumn()
    updatedAt = undefined;

    @Column('json')
    custom_fields = undefined;
}