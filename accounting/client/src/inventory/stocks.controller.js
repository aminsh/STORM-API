"use strict";

class StocksController {

    constructor($scope, $rootScope, $timeout, stockApi, logger, confirm, translate, navigate, reportParameters) {

        this.$timeout = $timeout;
        this.stockApi = stockApi;
        this.logger = logger;
        this.confirm = confirm;
        this.translate = translate;
        this.navigate = navigate;
        this.reportParameters = reportParameters;

        this.errors = [];

        let unRegisterStockChangedEvent = $rootScope.$on('onStockChanged', () => this.fetch());

        $scope.$on('$destroy', () => unRegisterStockChangedEvent());

        this.fetch();

    }

    fetch() {
        this.stockApi.getAll()
            .then(result => this.stocks = result.data);
    }

    remove(item) {
        let translate = this.translate;

        this.confirm(
            translate('Are you sure ?'),
            translate('Remove stock')
        ).then(() => this.$timeout(() => this._remove(item), 1000));

    }

    _remove(item) {

        this.stockApi.remove(item.id)
            .then(() => {
                this.logger.success();
                this.fetch();
            })
            .catch(errors => this.logger.error(errors.join('<br/>')));
    }

    inventoryTurnover() {

        let ids = this.stocks.asEnumerable()
            .where(item => item.isSelected)
            .select(item => item.id)
            .toArray();

        if (ids.length === 0)
            return this.logger.error(this.translate('Select inventory'));

        this.reportParameters.show([{name: "date"}])
            .then(params => {

                Object.assign(params, {ids});

                this.navigate(
                    'report.print',
                    {key: 902},
                    params);
            });
    }
}

export default StocksController;