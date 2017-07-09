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
        scaleId: entity.scaleId,
        scaleDisplay: entity.scaleDisplay,
        sumDiscount: entity.sumDiscount,
        sumQuantity: entity.sumQuantity,
        costOfGood: entity.costOfGood,
        countOnSale: entity.countOnSale
    };

    return viewModel;
}

module.exports = productAssembler;
