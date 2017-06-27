"use strict";

const enums = require('../../shared/enums');

function productAssembler(entity) {

    let viewModel = {
        id: entity.id,
        title: entity.title,
        productType: entity.productType,
        productTypeDisplay: enums.ProductType().getDisplay(entity.productType),
        reorderPoint: entity.reorderPoint,
        salePrice: entity.salePrice,
        categoryId: entity.categoryId,
        inventorySelect: entity.inventorySelect
    };

    return viewModel;
}

module.exports = productAssembler;
