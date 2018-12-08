import {ProductQuery} from "./ProductQuery";
import {ProductRepository} from "./ProductRepository";
import {ProductService} from "./ProductService";

import {ProductCategoryService} from "./ProductCategoryService";
import {ProductCategoryQuery} from "./ProductCategoryQuery";
import {ProductCategoryRepository} from "./ProductCategoryRepository";

import {ScaleQuery} from "./ScaleQuery";
import {ScaleService} from "./ScaleService";
import {ScaleRepository} from "./ScaleRepository";
import {ProductInventoryTransactionalRepository} from "./ProductInventoryTransactionalRepository";
import {ProductInventoryService} from "./ProductInventoryService";
import {ProductInventoryEventListener} from "./ProductInventoryEventListener";

import {PriceListQuery} from "./PriceListQuery";
import {PriceListRepository} from "./PriceListRepository";
import {PriceListService} from "./PriceListService";

import "./ProductController";
import "./ProductCategoryController";
import "./ScaleController";
import "./PriceListController";

export function register(container) {

    container.bind("ProductQuery").to(ProductQuery);
    container.bind("ProductRepository").to(ProductRepository);
    container.bind("ProductService").to(ProductService);

    container.bind("ProductCategoryService").to(ProductCategoryService);
    container.bind("ProductCategoryQuery").to(ProductCategoryQuery);
    container.bind("ProductCategoryRepository").to(ProductCategoryRepository);

    container.bind("ScaleQuery").to(ScaleQuery);
    container.bind("ScaleService").to(ScaleService);
    container.bind("ScaleRepository").to(ScaleRepository);

    container.bind("ProductInventoryService").to(ProductInventoryService).inTransientScope();
    container.bind("ProductInventoryTransactionalRepository").to(ProductInventoryTransactionalRepository).inTransientScope();
    container.bind("ProductInventoryEventListener").to(ProductInventoryEventListener);

    container.bind("PriceListQuery").to(PriceListQuery);
    container.bind("PriceListRepository").to(PriceListRepository);
    container.bind("PriceListService").to(PriceListService);


}