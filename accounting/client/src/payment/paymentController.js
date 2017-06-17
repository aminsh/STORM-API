export default class paymentController {
    constructor($scope, $uibModalInstance, formService, logger,promise,  devConstants,data,createFundService) {

        this.$scope = $scope;
        this.promise=promise;
        this.createFundService=createFundService,
        this.logger = logger;
        this.$uibModalInstance = $uibModalInstance;
        this.logger = logger;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.devConstants = devConstants;
        this.payment = [];
        this.totalPrice=data;

        this.urls = {
            getAllFunds: devConstants.urls.fund.getAll(),
        };

        this.fundDataSource= new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
                read: {
                    url: this.devConstants.urls.fund.getAll(),
                    dataType: "json"
                },
            },
            schema: {
                data:'data',
                total:'total'
            }
        });

        this.bankDataSource= new kendo.data.DataSource({
            serverFiltering: true,
            transport: {
                read: {
                    url: this.devConstants.urls.fund.getAll(),
                    dataType: "json"
                },
            },
            schema: {
                data:'data',
                total:'total'
            }
        });

    }

    removePayment(item) {
        this.payment.asEnumerable().remove(item);
    }

    createNewFund(title) {
        return this.promise.create((resolve, reject) => {
            this.createFundService.show({title})
                .then(result => {

                    resolve({id: result.id, title})
                });
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
            logger.error('مقدار وارد شده بیشتر از مبلغ فاکتور میباشد');
            return;
        }

        this.$scope.$close(payment);

    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
