"use strict";

function saleAssembler(entity) {

    var viewModel = {
        id: entity.id,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        detailAccountId: entity.detailAccountId,
        detailAccountDisplay: entity.detailAccountDisplay
    };

    return viewModel;
}

module.exports = saleAssembler;
