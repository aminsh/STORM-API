import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {PRODUCT_TYPE} from "./Product";
import {ProductCategory} from "./ProductCategory";

@Entity("productCategories")
export class CategoryView {

    @PrimaryColumn()
    id: string;

    @Column()
    title: string;
}

@Entity("scales")
export class ScaleView {

    @PrimaryColumn()
    id: string;

    @Column()
    title: string;
}

export class ViewBase {

    @Column({select: false})
    branchId: string;
}

@Entity("products_view")
export class ProductView extends ViewBase {

    @PrimaryColumn()
    id: string;

    title: string;

    @Column()
    code: string;

    @Column()
    barcode: string;

    @Column()
    productType: PRODUCT_TYPE;

    @Column({name: "referenceId"})
    reference: string;

    @Column()
    reorderPoint: number;

    @Column()
    salePrice: number;

    @Column()
    accountId: string;

    @Column()
    fiscalPeriodId: string;

    @Column()
    totalQuantity: number;

    @ManyToOne(() => CategoryView, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "categoryId"})
    category: CategoryView;

    @ManyToOne(() => ScaleView, {eager: true, cascade: true})
    @JoinColumn({referencedColumnName: "id", name: "scaleId"})
    scale: ScaleView;
}
