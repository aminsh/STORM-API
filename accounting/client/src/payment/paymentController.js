export default class paymentController {
    constructor($scope,
                $rootScope,
                $timeout,
                translate,
                formService,
                logger,
                promise,
                devConstants,
                fundApi,
                bankApi) {

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.promise = promise;
        this.logger = logger;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.translate = translate;
        this.devConstants = devConstants;
        this.payment = [];
        this.fundApi = fundApi;
        this.bankApi = bankApi;
        this.amount = $scope.amount || 0;
        this.receiveOrPay = $scope.receiveOrPay;
        this.today = localStorage.getItem('today');

        this.label = this.receiveOrPay === 'pay' ? this.payLabel : this.receiveLabel;

        this.urls = {
            getAllFunds: devConstants.urls.fund.getAll(),
            getAllBanks: devConstants.urls.bank.getAll(),
            getAllPeople: devConstants.urls.people.getAll()
        };
    }

    get payLabel() {
        return {
            newCash: 'New Cash',
            newBank: 'New Receipt',
            newCheque: 'New Cheque',
            newPerson: 'New Payment to person'
        };
    }

    get receiveLabel() {
        return {
            newCash: 'New Cash receive',
            newBank: 'New Receipt receive',
            newCheque: 'New Cheque receive',
            newPerson: 'New Payment to person receive'
        };
    }

    removePayment(item) {
        this.payment.asEnumerable().remove(item);
    }

    createNewFund(title) {
        this.fundApi.create({title: title}).then(result => {
            this.logger.success();
        });
    }

    createNewBank(title) {
        this.bankApi.create({title: title}).then(result => {
            this.logger.success();
        });
    }

    setFocus(item) {
        this.$timeout(() => {
            this.$scope.$broadcast(`payment-${this.payment.indexOf(item)}`);
        });
    }

    newCashPayment() {
        if (this.isPaymentCompletedAndSetWarningIfTrue())
            return;

        let newPayment = {
            style: "panel-info",
            date: null,
            amount: this.getRemainder(),
            fundId: null,
            fundDisplay: null,
            paymentType: 'cash',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('cash')
        };
        this.payment.push(newPayment);
        this.setFocus(newPayment);
    }

    newChequePayment() {
        if (this.isPaymentCompletedAndSetWarningIfTrue())
            return;

        let newPayment = {
            style: "panel-success",
            date: null,
            number: null,
            amount: this.getRemainder(),
            bankId: null,
            bankName: null,
            bankBranch: null,
            paymentType: 'cheque',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('cheque')
        };
        this.payment.push(newPayment);
        this.setFocus(newPayment);
    }

    newReceiptPayment() {
        if (this.isPaymentCompletedAndSetWarningIfTrue())
            return;

        let newPayment = {
            style: "panel-danger",
            date: null,
            amount: this.getRemainder(),
            bankId: null,
            bankDisplay: null,
            paymentType: 'receipt',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('receipt')
        };
        this.payment.push(newPayment);
        this.setFocus(newPayment);
    }

    newPersonPayment() {
        if (this.isPaymentCompletedAndSetWarningIfTrue())
            return;

        let newPayment = {
            style: "panel-default",
            date: null,
            amount: this.getRemainder(),
            personId: null,
            paymentType: 'person',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('person')
        };
        this.payment.push(newPayment);
        this.setFocus(newPayment);
    }

    isPaymentCompletedAndSetWarningIfTrue() {

        if (this.amount && this.getRemainder() <= 0) {
            this.logger.warning(this.translate('Amount is completed, you are not allowed to add another payment'));
            return true;
        }

        return;
    }

    onBankChanged(bank, item) {
        item.bankName = bank.bank;
        item.bankBranch = bank.bankBranch;
    }

    onFundChanged(fund, item) {
        item.fundDisplay = fund.title;
    }

    onBankChanged(bank, item) {
        item.bankDisplay = bank.title;
    }

    onAmountChanged(item) {
        if (!this.amount)
            return;

        let remainder = this.amount - (this.payment.asEnumerable()
            .where(e => e != item) || 0).sum(e => e.amount);

        if (item.amount > remainder)
            item.amount = remainder;
    }

    getRemainder() {
        if (!this.amount)
            return 0;

        return this.amount - (this.payment.asEnumerable().sum(e => e.amount) || 0);
    }

    save(form) {
        let logger = this.logger,
            formService = this.formService,
            payment = this.payment;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        this.errors.asEnumerable().removeAll();

        if (this.amount !== 0 && payment.asEnumerable().sum(item => item.amount) > this.amount) {
            logger.error(this.translate('The sum of the amount You entered is more than the amount'));
            return;
        }

        this.$scope.onSave({$payment: payment});
    }
}
