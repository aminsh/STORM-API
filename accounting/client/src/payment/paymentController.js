export default class paymentController {
    constructor($scope,
                $timeout,
                translate,
                $uibModalInstance,
                formService,
                logger,
                promise,
                devConstants,
                data,
                createFundService,
                fundApi,
                bankApi) {

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.promise = promise;
        this.createFundService = createFundService;
        this.logger = logger;
        this.$uibModalInstance = $uibModalInstance;
        this.logger = logger;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.translate = translate;
        this.devConstants = devConstants;
        this.payment = [];
        this.fundApi = fundApi;
        this.bankApi = bankApi;
        this.amount = data.amount;
        this.receiveOrPay = data.receiveOrPay;

        this.urls = {
            getAllFunds: devConstants.urls.fund.getAll(),
            getAllBanks: devConstants.urls.bank.getAll(),
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

    setFocus(item){
        this.$timeout(() => {
            this.$scope.$broadcast(`payment-${this.payment.indexOf(item)}`);
        });
    }

    newCashPayment() {
        if(this.getRemainder()<= 0) return;

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
        if(this.getRemainder()<= 0) return;

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
        if(this.getRemainder()<= 0) return;

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

    onAmountChanged(item){
        if(!this.amount)
            return;

        let remainder = this.amount - (this.payment.asEnumerable()
                .where(e => e != item) || 0).sum(e => e.amount);

        if(item.amount > remainder)
            item.amount = remainder;
    }

    getRemainder() {
        if(!this.amount)
            return 0;

        return this.amount - (this.payment.asEnumerable().sum(e => e.amount) || 0);
    }

    save(form) {
        let logger = this.logger,
            formService = this.formService,
            payment = this.payment;

        if (form.$invalid) {
            return formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();

        if (this.amount != 0 && payment.asEnumerable().sum(item => item.amount) > this.totalPrice.amount) {
            logger.error(this.translate('The sum of the amount You entered is more than the amount'));
            return;
        }

        this.$scope.$close(payment);

    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
