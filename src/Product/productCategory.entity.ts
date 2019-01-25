import {Column, Entity, OneToMany} from "typeorm";
import {Product} from "./product.entity";
import {BranchSupportEntity} from "../Infrastructure/Domain/BranchSupportEntity";

@Entity("productCategories")
export class ProductCategory extends BranchSupportEntity {

    @Column()
    title: string;

    @OneToMany(type => Product, product => product.category)
    products: Promise<Product[]>;

}