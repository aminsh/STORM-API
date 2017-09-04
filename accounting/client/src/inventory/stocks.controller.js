"use strict";

class StocksController {

    constructor($scope, $rootScope, stockApi, logger, confirm, translate) {
        this.stockApi = stockApi;
        this.logger = logger;
        this.confirm = confirm;
        this.translate = translate;

        this.errors = [];

        let unRegisterStockChangedEvent = $rootScope.$on('onStockChanged', () => this.fetch());

        $scope.$on('$destroy', () => unRegisterStockChangedEvent());

        this.fetch();

    }

    fetch() {
        this.stockApi.getAll()
            .then(result => this.stocks = result.data);
    }

    remove(id) {
        let translate = this.translate;

        this.confirm(
            translate('Are you sure ?'),
            translate('Remove stock')
        ).then(() => {
            this.stockApi.remove(id)
                .then(() => this.logger.success())
                .catch(errors => this.errors = errors);
        });
    }
}

export default StocksController;