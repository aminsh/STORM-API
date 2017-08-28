var enums = instanceOf('Enums');

function chequeAssembler(entity) {
    var viewModel = {
        id: entity.id,
        number: entity.number,
        date: entity.date,
        description: entity.description,
        amount: entity.amount,
        status: entity.status,
        statusDisplay: enums.ChequeStatus().getDisplay(entity.status)
    };

    return viewModel;
}

module.exports = chequeAssembler;
