"use strict";

export default class BanksAndFundsController {
    constructor($scope,
                $rootScope,
                $timeout,
                bankAndFundApi,
                confirm,
                bankApi,
                fundApi,
                logger,
                translate,
                devConstants) {

        this.$timeout = $timeout;
        this.bankApi = bankApi;
        this.fundApi = fundApi;
        this.confirm = confirm;
        this.logger = logger;
        this.translate = translate;
        this.bankAndFundApi = bankAndFundApi;
        this.urls = devConstants.urls;

        this.fetch();

        let unRegisterFundChangedEvent = $rootScope.$on('onFundChanged', () => this.fetch()),
            unRegisterBankChangedEvent = $rootScope.$on('onBankChanged', () => this.fetch());

        $scope.$on('$destroy', () => {
            unRegisterFundChangedEvent();
            unRegisterBankChangedEvent();
        });

        this.tinyTurnoverGridOption = {
            columns: [
                {
                    name: 'status',
                    title: translate('Status'),
                    filterable: false,
                    template: `<i
                        ng-class="{
                            'text-danger':item.creditor!=0,
                            'text-navy':item.debtor!=0,
                            'fa-rotate-90': item.creditor!=0,
                            'fa-rotate-270': item.debtor!=0
                        }"
                        class="fa fa-play "
                        style="font-weight: bold"></i>`,
                    width: '100px',
                },
                {
                    name: 'date',
                    title: translate('Date'),
                    width: '100px',
                },
                {
                    name: 'article',
                    title: translate('Journal description'),
                    template: '<span title="{{item.article}}">{{item.article}}</span>'
                },
                {
                    name: 'amount',
                    title: translate('Amount'),
                    template: `<i 
                        ng-class="{
                            'text-danger': item.creditor!=0,
                            'text-navy': item.debtor!=0
                        }"
                        style="font-weight: bold"
                        >{{item.creditor === 0 ? item.debtor : item.creditor | number}}</i>`,
                    width: '120px',
                }
            ],
            commands: [],
            readUrl: '',
            gridSize: '500px'
        };

        this.current = false;
    }

    fetch() {
        this.bankAndFundApi.all()
            .then(result => this.banksAndFunds = result);
    }

    remove(item) {
        let translate = this.translate;

        this.confirm(
            translate('Are you sure ?'),
            translate(item.type == 'bank' ? 'Remove Bank' : 'Remove fund')
        )
            .then(() => {
                this[`${item.type}Api`].remove(item.id)
                    .then(() => {
                        this.logger.success();
                        this.fetch();
                    })
            });
    }

    showTinyTurnover(item) {
        this.current = item;
        this.tinyTurnoverGridOption.readUrl = this.urls[item.type].getAllTinyTurnonver(item.id);
        /*this.current = false;
         this.$timeout(() => );*/
    }
}