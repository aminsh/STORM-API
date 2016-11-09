var enums = require('../constants/enums');

function generalLedgerAccountView(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        title: entity.title,
        display: entity.display,
        postingType: entity.postingType,
        balanceType: entity.balanceType,
        postingTypeDisplay: entity.postingType ? enums.AccountPostingType().getDisplay(entity.postingType) : '',
        balanceTypeDisplay: entity.balanceType ? enums.AccountBalanceType().getDisplay(entity.balanceType) : '',
        description: entity.description,
        isActive: entity.isActive
    };

    return viewModel;
}

module.exports = generalLedgerAccountView;