var enums = instanceOf('Enums');

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
        balanceType: entity.balanceType,
        balanceTypeDisplay: entity.balanceType ? enums.AccountBalanceType().getDisplay(entity.balanceType) : '',
        hasDetailAccount: entity.hasDetailAccount,
        hasDimension1: entity.hasDimension1,
        hasDimension2: entity.hasDimension2,
        hasDimension3: entity.hasDimension3,
        description: entity.description,
        isLocked: entity.isLocked
    };

    return viewModel;
}

module.exports = subsidiaryLedgerAccountAssembler;
