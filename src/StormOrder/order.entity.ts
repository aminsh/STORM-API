import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Branch } from "../Branch/branch.entity";
import { Gift } from "./gift.entity";
import { Plan } from "./plan.entity";

@Entity('storm_orders')
export class Order {
    @PrimaryColumn()
    id: string;

    @Column()
    invoiceId: string;

    @Column()
    number: number;

    @Column()
    issuedDate: Date;

    @Column()
    paidDate: Date;

    @ManyToOne(() => Branch, { eager : true })
    @JoinColumn()
    branch: Branch;

    @ManyToOne(() => Gift, { eager : true })
    @JoinColumn()
    gift: Gift;

    @ManyToOne(() => Plan, {eager: true})
    @JoinColumn()
    plan: Plan;

    @Column()
    duration: number;

    @Column()
    unitPrice: number;

    @Column()
    discount: number;

    @Column()
    vat: number = 0;

    get payable(): number {
        return (this.duration * this.unitPrice) - this.discount + this.vat;
    }
}