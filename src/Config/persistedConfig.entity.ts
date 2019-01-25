import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('config')
export class PersistedConfig {
    @PrimaryColumn()
    key: string;

    @Column()
    value: string;
}