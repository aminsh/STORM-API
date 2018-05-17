"use strict";

const enums = require('../../../shared/enums');

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
        referenceId: entity.referenceId,
        sumSalePrice: entity.sumSalePrice,
        sumDiscount: entity.sumDiscount,
        countOnSale: entity.countOnSale,
        sumQuantity: entity.sumQuantity,
        costOfGood: entity.costOfGood,
        barcode: entity.barcode
    };

    return viewModel;
}

module.exports = productAssembler;
