import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('storm_gifts')
export class Gift {
    @PrimaryColumn()
    id: string;

    @Column()
    code: string;

    @Column({nullable: true})
    minDate: string;

    @Column({nullable: true})
    maxDate: string;

    @Column()
    discountRate: number;

    @Column()
    duration: number;

    @Column('json', {name: 'plans'})
    planIds: string[];

    @Column()
    usable: boolean;

    @Column()
    unlimited: boolean;

    @Column()
    isActive: boolean;
}