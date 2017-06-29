"use strict";

export default class ExpenseCreateController {
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
            getAllExpense: devConstants.urls.subsidiaryLedgerAccount.allExpenses(),
            getAllPeople: devConstants.urls.people.getAll()
        };

        this.expense = {
            personId: null,
            date: localStorage.getItem('today'),
            expenseSubLedgerId: null,
            description: ''
        };

        this.payments = [];

        this.errors = [];
        this.isSaving = false;
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        if (this.payments.length == 0)
            return this.logger.error(this.translate('There are not any payments'));

        this.errors = [];
        this.isSaving = true;

        let cmd = Object.assign(this.expense, {payments: this.payments});

        this.financialOperationsApi.createExpense(cmd)
            .then(() => this.logger.success())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    createPayment() {
        this.createPaymentService.show({receiveOrPay: 'pay'})
            .then(payments => this.payments = payments);
    }

    removePayment(item){
        this.payments.asEnumerable().remove(item);
    }
}