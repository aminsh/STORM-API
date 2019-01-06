import {interfaces} from "inversify";
import Container = interfaces.Container;
import {ProductRepository} from "./ProductRepository";
import {ProductService} from "./ProductService";
import {ProductCategoryRepository} from "./ProductCategoryRepository";
import {ProductCategoryService} from "./ProductCategoryService";
import {ScaleRepository} from "./ScaleRepository";
import {ScaleService} from "./ScaleService";
import "./ProductController";
import {ProductQuery} from "./ProductQuery";

export function register(container: Container) {

    container.bind("ProductRepository").to(ProductRepository);
    container.bind("ProductService").to(ProductService);
    container.bind("ProductCategoryRepository").to(ProductCategoryRepository);
    container.bind("ProductCategoryService").to(ProductCategoryService);
    container.bind("ScaleRepository").to(ScaleRepository);
    container.bind("ScaleService").to(ScaleService);
    container.bind("ProductQuery").to(ProductQuery);
}