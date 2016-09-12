var enums = require('../constants/enums');

function generalLedgerAccountView(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        title: entity.title,
        display: '{0} {1}'.format(entity.code, entity.title),
        postingType: entity.postingType,
        balanceType: entity.balanceType,
        postingTypeDisplay: enums.AccountPostingType().getDisplay(entity.postingType),
        balanceTypeDisplay: enums.AccountBalanceType().getDisplay(entity.balanceType),
        description: entity.description,
        isActive: entity.isActive
    }

    return viewModel;
}

module.exports = generalLedgerAccountView;