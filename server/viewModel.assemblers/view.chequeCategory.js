var enums = require('../constants/enums');

function chequeCategoryAssembler(entity) {
    var viewModel = {
        id: entity.id,
        bankId: entity.bankId,
        bank: entity.bank,
        detailAccountId: entity.detailAccountId,
        detailAccount: entity.detailAccount,
        totalPages: entity.totalPages,
        firstPageNumber: entity.firstPageNumber,
        lastPageNumber: entity.lastPageNumber,
        description: entity.description,
        status: entity.isClosed ? 'Closed' : 'Open',
        statusDisplay: enums.ChequeCategoryStatus().getDisplay(entity.isClosed ? 'Closed' : 'Open')
    };

    return viewModel;
}

module.exports = chequeCategoryAssembler;

