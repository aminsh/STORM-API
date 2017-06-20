export default class paymentController {
    constructor($scope,translate, $uibModalInstance, formService, logger,promise,  devConstants,data,createFundService,fundApi,bankApi) {

        this.$scope = $scope;
        this.promise=promise;
        this.createFundService=createFundService,
        this.logger = logger;
        this.$uibModalInstance = $uibModalInstance;
        this.logger = logger;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.translate=translate;
        this.devConstants = devConstants;
        this.payment = [];
        this.fundApi=fundApi;
        this.bankApi=bankApi;
        this.totalPrice=data;

        this.urls = {
            getAllFunds: devConstants.urls.fund.getAll(),
            getAllBanks: devConstants.urls.bank.getAll(),
        };
    }

    removePayment(item) {
        this.payment.asEnumerable().remove(item);
    }

    createNewFund(title) {
        this.fundApi.create({title:title}).then(result=>{
            this.logger.success();
        });
    }

    createNewBank(title) {
        this.bankApi.create({title:title}).then(result=>{
            this.logger.success();
        });
    }

    newCashPayment() {
        let newPayment = {
            style:"panel-info",
            date: null,
            amount: 0,
            fundId:null,
            paymentType: 'cash',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('cash')
        };
        this.payment.push(newPayment);
    }

    newChequePayment() {
        let newPayment = {
            style:"panel-success",
            date: null,
            number:null,
            amount: 0,
            bankName:null,
            bankBranch:null,
            paymentType: 'cheque',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('cheque')
        };
        this.payment.push(newPayment);
    }

    newReceiptPayment() {
        let newPayment = {
            style:"panel-danger",
            date: null,
            amount: 0,
            bankId:null,
            paymentType: 'receipt',
            paymentDisplay: this.devConstants.enums.paymentType().getDisplay('receipt')
        };
        this.payment.push(newPayment);
    }

    save(form) {
        let logger = this.logger,
            formService = this.formService,
            payment = this.payment;

        if (form.$invalid) {
            return formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();

        if(payment.asEnumerable().sum(item=>item.amount)>this.totalPrice.amount){
            logger.error(this.translate('The sum of the amount You entered is more than the amount'));
            return;
        }

        this.$scope.$close(payment);

    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
