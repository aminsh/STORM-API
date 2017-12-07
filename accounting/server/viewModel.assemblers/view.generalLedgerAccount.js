var enums = require('../../../shared/enums');

function generalLedgerAccountView(entity) {
    var viewModel = {
        id: entity.id,
        code: entity.code,
        title: entity.title,
        display: entity.display,
        postingType: entity.postingType,
        groupingType: entity.groupingType,
        postingTypeDisplay: entity.postingType ? enums.AccountPostingType().getDisplay(entity.postingType) : '',
        description: entity.description,
        isLocked: entity.isLocked
    };

    return viewModel;
}

module.exports = generalLedgerAccountView;