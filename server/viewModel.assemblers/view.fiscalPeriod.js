function fiscalPeriodView(entity) {
    var viewModel = {
        id: entity.id,
        display: entity.display
    };

    return viewModel;
}

module.exports = fiscalPeriodView;
