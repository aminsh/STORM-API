"use strict";

function bankAssembler(entity) {
    return {
        id: entity.id,
        code: entity.code,
        display: entity.display,
        title: entity.title,
        description: entity.description,
        bank: entity.bank,
        bankAccountNumber: entity.bankAccountNumber,
        bankAccountCartNumber: entity.bankAccountCartNumber,
        bankBranch: entity.bankBranch
    };
}

module.exports = bankAssembler;
