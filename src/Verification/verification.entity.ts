import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('verification')
export class Verification {
    @PrimaryColumn()
    id: string;

    @Column()
    code: number;

    @Column()
    mobile: string;

    @Column('json')
    data: { userId: string }
}
