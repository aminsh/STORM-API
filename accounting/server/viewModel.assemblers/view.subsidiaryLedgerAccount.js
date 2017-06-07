var enums = require('../constants/enums');

function subsidiaryLedgerAccountAssembler(entity) {
    var viewModel = {
        id: entity.id,
        generalLedgerAccountId: entity.generalLedgerAccountId,
        generalLedgerAccountDisplay: entity.generalLedgerAccountDisplay,
        code: entity.code,
        title: entity.title,
        display: entity.display,
        account: entity.account,
        isBankAccount: entity.isBankAccount,
        hasDetailAccount: entity.hasDetailAccount,
        hasDimension1: entity.hasDimension1,
        hasDimension2: entity.hasDimension2,
        hasDimension3: entity.hasDimension3,
        description: entity.description,
        isActive: entity.isActive
    };

    return viewModel;
}

module.exports = subsidiaryLedgerAccountAssembler;
