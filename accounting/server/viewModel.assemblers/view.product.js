"use strict";

function productAssembler(entity) {
    var viewModel = {
        id: entity.id,
        title: entity.title
    };

    return viewModel;
}

module.exports = productAssembler;
