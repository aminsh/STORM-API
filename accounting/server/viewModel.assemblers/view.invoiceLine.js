"use strict";

module.exports = function (entity) {
    return {
        id: entity.id,
        productId: entity.productId,
        description: entity.description,
        quantity: entity.quantity,
        unitPrice: entity.unitPrice,
        tax: entity.tax,
        vat: entity.vat,
        discount: entity.discount,
        scale: entity.scale,
        stockId: entity.stockId,
        stockDisplay: entity.stockDisplay,
    };
};

