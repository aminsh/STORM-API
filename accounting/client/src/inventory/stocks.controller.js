"use strict";

class StocksController {

    constructor($scope, $rootScope, stockApi, logger, confirm, translate, navigate) {
        this.stockApi = stockApi;
        this.logger = logger;
        this.confirm = confirm;
        this.translate = translate;
        this.navigate = navigate;

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
        ).then(() => {
            this.stockApi.remove(item.id)
                .then(() => {
                    this.logger.success();
                    this.fetch();
                })
                .catch(errors => this.errors = errors);
        });
    }


    inventoryTurnover(){
        /*const ids = ;
        if(ids.length === 0){
            this.logger.error(this.translate('Select inventory input'));}
        else {
            let reportParam = {ids};
            this.navigate(
                'report.print',
                {key: 802},
                reportParam);
        }*/
    }
}

export default StocksController;