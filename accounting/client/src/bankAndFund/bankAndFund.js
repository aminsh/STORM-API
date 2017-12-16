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
                devConstants,
                reportApi,
                exportToExcel) {

        this.$timeout = $timeout;
        this.bankApi = bankApi;
        this.fundApi = fundApi;
        this.confirm = confirm;
        this.logger = logger;
        this.translate = translate;
        this.bankAndFundApi = bankAndFundApi;
        this.urls = devConstants.urls;
        this.reportApi = reportApi;
        this.exportToExcel = exportToExcel;

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
                    css: 'text-center',
                    width: '40px',
                },
                {
                    name: 'number',
                    title: translate('Journal number'),
                    css: 'text-center',
                    width: '70px',
                    header: {
                        css: 'text-center'
                    },

                },
                {
                    name: 'date',
                    title: translate('Date'),
                    css: 'text-center',
                    width: '50px',
                    header: {
                        css: 'text-center'
                    },

                },
                {
                    name: 'article',
                    title: translate('Journal description'),
                    template: '<span title="{{item.article}}">{{item.article}}</span>',
                    css: 'giveMeEllipsis'
                },
                {
                    name: 'debtor',
                    title: translate('Debtor'),
                    width: '80px',
                    template: '<span><b>{{item.debtor|number}}</b></span>'
                },
                {
                    name: 'creditor',
                    title: translate('Creditor'),
                    width: '80px',
                    template: '<span><b>{{item.creditor|number}}</b></span>'
                },
                {
                    name: 'remainder',
                    title: translate('Remainder'),
                    width: '80px',
                    template: '<span><b>{{item.remainder|amount}}</b></span>'
                }
            ],
            commands: [],
            sort: [
                {dir: 'asc', field: 'date'}
            ],
            readUrl: '',
            gridSize: '500px'
        };

        this.tinyTurnoverGridOption.columns.forEach(col => {
            col.style = {
                fontSize: '12px'
            };
            col.filterable = false;
            col.sortable = false;
        });

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
    }

    runExportToExcel() {
        let columns = this.tinyTurnoverGridOption.columns,
            exportedData = [];

        this.api.tinyTurnover(this.current.id)
            .then(result => {
                let data = result.data;

                data.forEach((item) => {
                    let result = {};
                    columns.forEach(col => {
                        result[col.title] = item[col.name];
                    });

                    exportedData.push(result);
                });

                this.exportToExcel(exportedData, "BankOrFoundTurnover");
            });
    }

    get api(){
        if(this.current.type === 'fund')
            return this.fundApi;

        if(this.current.type === 'bank')
            return this.bankApi;
    }
}