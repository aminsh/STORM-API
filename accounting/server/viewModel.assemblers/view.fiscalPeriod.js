function fiscalPeriodView(entity) {
    var viewModel = {
        title: entity.title,
        minDate: entity.minDate,
        maxDate: entity.maxDate,
        id: entity.id,
        display: entity.display
    };

    return viewModel;
}

module.exports = fiscalPeriodView;
