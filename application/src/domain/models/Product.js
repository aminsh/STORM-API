import {EntityBase} from "./EntityBase";
import {Column, JoinColumn, ManyToOne, Entity, OneToMany} from "typeorm";
import {ProductCategory} from "./ProductCategory";
import {InvoiceLine} from "./Invoice";

@Entity("products")
export class Product extends EntityBase{

    @Column("character varying",{length:255})
    title = undefined;


    @Column("character varying",{length:255})
    code = undefined;


    @Column("character varying",{length:255})
    referenceId = undefined;

    @Column("character varying",{length:255})
    barcode = undefined;

    @Column("text")
    productType = undefined;


    @Column("float",{
        nullable:true,
        precision:24,
    })
    reorderPoint = undefined;


    @Column("float",{
        nullable:true,
        precision:24,
    })
    salePrice = undefined;

    /** @type {ProductCategory}*/
    @ManyToOne(type => ProductCategory, {eager: true})
    @JoinColumn({name: "categoryId", referencedColumnName: "id"})
    category = undefined;



    @ManyToOne(type=> Scale, Scale => Scale.products, {eager: true})
    @JoinColumn({name: "scaleId", referencedColumnName: "id"})
    scale = undefined;

    @OneToMany(type => InvoiceLine,  InvoiceLine => InvoiceLine.product)
    invoiceLines = undefined;
}