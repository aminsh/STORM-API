import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";
import { ProductCategoryRepository } from "./productCategory.repository";
import { ProductCategoryService } from "./productCategory.service";
import { ScaleRepository } from "./scale.repository";
import { ScaleService } from "./scale.service";
import { ProductController } from "./product.controller";
import { Module } from "../Infrastructure/ModuleFramework";

@Module({
    providers : [
        ProductRepository,
        ProductService,
        ProductCategoryRepository,
        ProductCategoryService,
        ScaleRepository,
        ScaleService
    ],
    controllers : [ ProductController ]
})
export class ProductModule {
}