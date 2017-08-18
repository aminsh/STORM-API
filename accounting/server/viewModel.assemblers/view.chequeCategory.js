var enums = instanceOf('Enums');

function chequeCategoryAssembler(entity) {
    var viewModel = {
        id: entity.id,
        display: entity.display,
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

