import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductCategory} from "./ProductCategory";
import {BranchSupportEntity} from "../Infrastructure/Domain/BranchSupportEntity";
import {Scale} from "./Scale";

@Entity("products")
export class Product extends BranchSupportEntity {

    @Column({nullable: false})
    title: string;

    @Column({nullable: true})
    code: string;

    @Column({nullable: true})
    barcode: string;

    @Column()
    productType: PRODUCT_TYPE = PRODUCT_TYPE.GOOD;

    @Column({name: "referenceId", nullable: true})
    reference: string;

    @Column({nullable: true})
    reorderPoint: number;

    @Column({nullable: true})
    salePrice: number;

    @ManyToOne(() => ProductCategory, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "categoryId"})
    category: ProductCategory;

    @ManyToOne(() => Scale, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "scaleId"})
    scale: Scale;

    @Column({nullable: true})
    accountId: string;
}

export enum PRODUCT_TYPE {
    GOOD = "good",
    SERVICE = "service"
}
