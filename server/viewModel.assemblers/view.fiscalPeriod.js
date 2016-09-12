function fiscalPeriodView(entity) {
    var viewModel = {
        id: entity.id,
        display: '{0} - {1}'.format(entity.minDate, entity.maxDate)
    };

    return viewModel;
}

module.exports = fiscalPeriodView;
