"use strict";

export default class TransferMoneyController {
    constructor($scope,
                financialOperationsApi,
                formService,
                logger,
                devConstants) {

        this.financialOperationsApi = financialOperationsApi;
        this.formService = formService;
        this.logger = logger;

        this.isSaving = false;
        this.errors = [];

        this.transferMoney = {
            date: localStorage.getItem('today'),
            description: '',
            amount: 0,
            source: {
                type: 'fund',
                accountId: null
            },
            target: {
                type: 'bank',
                accountId: null
            }
        };

        $scope.$watch(
            () => this.transferMoney.target.type,
            () => this.transferMoney.target.accountId = null);

        $scope.$watch(
            () => this.transferMoney.source.type,
            () => this.transferMoney.source.accountId = null);

        this.cashTypes = devConstants.enums.DetailAccountType().data
            .asEnumerable()
            .where(e => e.key != 'person').toArray();

        this.urls = {
            getAllBanks: devConstants.urls.bank.getAll(),
            getAllFunds: devConstants.urls.fund.getAll()
        };
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        this.errors = [];
        this.isSaving = true;

        this.financialOperationsApi.transferMoney(this.transferMoney)
            .then(() => {
                this.logger.success();
                this.reset(form);
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    reset(form) {
        this.transferMoney = {
            date: localStorage.getItem('today'),
            description: '',
            amount: 0,
            source: {
                type: 'fund',
                accountId: null
            },
            target: {
                type: 'bank',
                accountId: null
            }
        };

        this.formService.setClean(form);
    }
}