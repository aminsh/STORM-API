"use strict";

const enums = require('../../shared/enums');

function detailAccountAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description,
        isActive: entity.isActive,
        address: entity.address,
        phone: entity.phone,
        nationalCode: entity.nationalCode,
        economyCode: entity.economyCode,
        bank: entity.bank,
        email: entity.email,
        personType: entity.personType,
        personTypeDisplay: entity.personType ? enums.PersonType().getDisplay(entity.personType) : ''
    };

    return viewModel;
}

module.exports = detailAccountAssembler;
