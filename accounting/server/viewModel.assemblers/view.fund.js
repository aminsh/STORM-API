"use strict";

const enums = require('../../../shared/enums');

function fundAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description
    };

    return viewModel;
}

module.exports = fundAssembler;
