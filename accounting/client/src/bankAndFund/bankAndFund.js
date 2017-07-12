"use strict";

export default class BanksAndFundsController {
    constructor($scope, bankAndFundApi, confirm, bankApi, fundApi, logger, translate, $rootScope) {

        this.bankApi = bankApi;
        this.fundApi = fundApi;
        this.confirm = confirm;
        this.logger = logger;
        this.translate = translate;
        this.bankAndFundApi = bankAndFundApi;

        this.fetch();

        let unRegisterFundChangedEvent = $rootScope.$on('onFundChanged', () => this.fetch()),
            unRegisterBankChangedEvent = $rootScope.$on('onBankChanged', () => this.fetch());

        $scope.$on('$destroy', () => {
            unRegisterFundChangedEvent();
            unRegisterBankChangedEvent();
        });
    }

    fetch() {
        this.bankAndFundApi.all()
            .then(result => this.banksAndFunds = result);
    }

    remove(item) {
        let translate = this.translate;

        this.confirm(
            translate(item.type == 'bank' ? 'Remove Bank' : 'Remove fund'),
            translate('Are you sure ?'))
            .then(() => {
                this[`${item.type}Api`].remove(item.id)
                    .then(() => {
                        this.logger.success();
                        this.fetch();
                    })
            });
    }
}