"use strict";

const enums = require('../../shared/enums');

function bankAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description,
        bank: entity.bank,
        bankAccountNumber: entity.bankAccountNumber,
        bankBranch: entity.bankBranch
    };

    return viewModel;
}

module.exports = bankAssembler;
