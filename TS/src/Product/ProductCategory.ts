import {Column, Entity, OneToMany} from "typeorm";
import {Product} from "./Product";
import {BranchSupportEntity} from "../Infrastructure/Domain/BranchSupportEntity";
import * as toResult from "asyncawait/await";

@Entity("productCategories")
export class ProductCategory extends BranchSupportEntity {

    @Column()
    title: string;

    @OneToMany(type => Product, product => product.category)
    products: Promise<Product[]>;

    getProducts(): Product[] {
        return toResult(this.products);
    }
}