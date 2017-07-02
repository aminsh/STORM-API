"use strict";

import accModule from "../acc.module";
import ProductsController from "./products.controller";
import ProductEntry from "./product.entry";
import ProductApi from "./productApi";
import ProductCategoryApi from './productCategoryApi';
import ProductMoreInfoController from './ProductMoreInfoController';

function productEntryService(modalBase) {
    return modalBase({
        controller: ProductEntry,
        controllerAs: 'model',
        templateUrl: 'partials/product/product.entry.html'
    });
}

accModule
    .controller('productsController', ProductsController)
    .controller('ProductMoreInfoController',ProductMoreInfoController)
    .controller('productEntryController', ProductEntry)
    .factory('productCreateService', productEntryService)
    .service('productApi', ProductApi)
    .service('productCategoryApi', ProductCategoryApi);


