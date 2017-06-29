"use strict";

export default class IncomeCreateController {
    constructor(financialOperationsApi,
                formService,
                logger,
                createPaymentService,
                translate,
                devConstants) {
        this.financialOperationsApi = financialOperationsApi;
        this.formService = formService;
        this.logger = logger;
        this.createPaymentService = createPaymentService;
        this.translate = translate;

        this.urls = {
            getAllIcomes: devConstants.urls.subsidiaryLedgerAccount.allIncomes(),
            getAllPeople: devConstants.urls.people.getAll()
        };

        this.income = {
            personId: null,
            date: localStorage.getItem('today'),
            incomeSubLedgerId: null,
            description: ''
        };

        this.payments = [];

        this.errors = [];
        this.isSaving = false;
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        if (this.payments.length == 0){
            console.log(';;;;');
            return this.logger.error(this.translate('There are not any payments'));
        }


        this.errors = [];
        this.isSaving = true;

        let cmd = Object.assign(this.income, {payments: this.payments});

        this.financialOperationsApi.createIncome(cmd)
            .then(() => this.logger.success())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    createPayment() {
        this.createPaymentService.show({receiveOrPay: 'receive'})
            .then(payments => this.payments = payments);
    }

    removePayment(item){
        this.payments.asEnumerable().remove(item);
    }
}