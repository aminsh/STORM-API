"use strict";

import accModule from "../acc.module";
import ProductsController from "./products.controller";
import ProductEntry from "./product.entry";
import ProductApi from "./productApi";

function productEntryService(modalBase) {
    return modalBase({
        controller: ProductEntry,
        controllerAs: 'model',
        templateUrl: 'partials/product/product.entry.html'
    });
}

accModule
    .controller('productsController', ProductsController)
    .controller('productEntryController', ProductEntry)
    .factory('productCreateService', productEntryService)
    .service('productApi', ProductApi);


