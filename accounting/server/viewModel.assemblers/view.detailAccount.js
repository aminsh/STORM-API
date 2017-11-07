"use strict";

const enums = require('../../../shared/enums');

function detailAccountAssembler(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description,
        isActive: entity.isActive,
        address: entity.address,
        postalCode: entity.postalCode,
        province: entity.province,
        city: entity.city,
        phone: entity.phone,
        fax: entity.fax,
        nationalCode: entity.nationalCode,
        economicCode: entity.economicCode,
        bank: entity.bank,
        bankAccountNumber: entity.bankAccountNumber,
        bankBranch: entity.bankBranch,
        email: entity.email,
        personType: entity.personType,
        personTypeDisplay: entity.personType ? enums.PersonType().getDisplay(entity.personType) : ''
    };

    return viewModel;
}

module.exports = detailAccountAssembler;
