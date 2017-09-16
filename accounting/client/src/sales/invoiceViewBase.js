class InvoiceViewBaseController {
    constructor($scope,
                $state,
                $stateParams,
                navigate,
                logger,
                api,
                createPaymentService,
                sendInvoiceEmail) {

        this.$scope = $scope;
        this.$state = $state;
        this.navigate = navigate;
        this.logger = logger;
        this.createPaymentService = createPaymentService;
        this.sendInvoiceEmail = sendInvoiceEmail;

        this.api = api;
        this.id = $stateParams.id;

        this.fetchInvoice();
    }

    fetchInvoice() {

        this.isLoading = true;

        this.api.getById(this.id)
            .then(result => this.invoice = result)
            .finally(() => this.isLoading = false);
    }

    getPayments() {

        this.api.payments(this.id)
            .then(result => this.payments = result);

    }

    recordPayment() {

        this.createPaymentService
            .show({
                amount: this.invoice.sumRemainder,
                receiveOrPay: 'receive'
            })
            .then(result => {
                this.isLoading = true;

                this.api.pay(this.invoice.id, result)
                    .then(() => {
                        this.logger.success();
                        this.getPayments();
                        this.fetchInvoice();
                    })
                    .catch(errors => this.errors = errors)
                    .finally(() => this.isLoading = false);
            });
    }

    print() {

        this.navigate('report.print', {key: 700}, {id: this.id});
    }

    sendEmail() {

        this.sendInvoiceEmail.show({
            invoiceId: this.invoice.id,
            personId: this.invoice.detailAccountId
        });
    }
}

export default InvoiceViewBaseController;