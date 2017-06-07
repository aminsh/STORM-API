"use strict";

function purchaseLineAssembler(entity) {

    var viewModel = {
        id: entity.id,
        productId: entity.productId,
        productDisplay: entity.productDisplay,
        quantity: entity.quantity,
        unitPrice: entity.unitPrice,
        vat: entity.vat,
        discount: entity.discount
    };

    return viewModel;
}

module.exports = purchaseLineAssembler;
