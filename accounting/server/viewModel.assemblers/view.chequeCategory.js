var enums = instanceOf('Enums');

function chequeCategoryAssembler(entity) {
    var viewModel = {
        id: entity.id,
        receiveDate: entity.receiveDate,
        bankId: entity.bankId,
        bankDisplay: entity.bankDisplay,
        bankName: entity.bankName,
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

