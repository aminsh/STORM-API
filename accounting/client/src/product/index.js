"use strict";

import accModule from "../acc.module";
import ProductsController from "./products.controller";
import ProductEntry from "./product.entry";
import ProductApi from "./productApi";
import ScaleApi from './scaleApi';
import ProductCategoryApi from './productCategoryApi';
import ProductMoreInfoController from './productMoreInfoController';
import ProductImportFromExcel from "./product.importFromExcel";

function productEntryService(modalBase) {
    return modalBase({
        controller: ProductEntry,
        controllerAs: 'model',
        templateUrl: 'partials/product/product.entry.html'
    });
}

function productImportFromExcelService(modalBase) {
    return modalBase({
        controller: ProductImportFromExcel,
        controllerAs: 'model',
        templateUrl: 'partials/product/product.importFromExcel.html'
    });
}


accModule
    .controller('productsController', ProductsController)
    .controller('ProductMoreInfoController',ProductMoreInfoController)
    .controller('productEntryController', ProductEntry)
    .controller('productImportFromExcelController', ProductImportFromExcel)
    .factory('productCreateService', productEntryService)
    .factory('productImportFromExcelService', productImportFromExcelService)
    .service('productApi', ProductApi)
    .service('scaleApi', ScaleApi)
    .service('productCategoryApi', ProductCategoryApi);


