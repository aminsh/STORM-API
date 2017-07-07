var enums = require('../../shared/enums');

function generalLedgerAccountView(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        title: entity.title,
        display: entity.display,
        postingType: entity.postingType,
        balanceType: entity.balanceType,
        groupingType: entity.groupingType,
        postingTypeDisplay: entity.postingType ? enums.AccountPostingType().getDisplay(entity.postingType) : '',
        balanceTypeDisplay: entity.balanceType ? enums.AccountBalanceType().getDisplay(entity.balanceType) : '',
        groupingTypeDisplay: entity.groupingType ? enums.AccountGroupingType().getDisplay(entity.groupingType) : '',
        description: entity.description,
        isLocked: entity.isLocked
    };

    return viewModel;
}

module.exports = generalLedgerAccountView;