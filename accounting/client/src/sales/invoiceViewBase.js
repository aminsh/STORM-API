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
            .then(result => {
                this.invoice = result;

                let itemVatNotZero =  this.invoice.invoiceLines.asEnumerable().firstOrDefault(item => item.vat !== 0);

                this.vat = itemVatNotZero
                    ? (100 * itemVatNotZero.vat) / ((itemVatNotZero.quantity * itemVatNotZero.unitPrice) - itemVatNotZero.discount)
                    : 0;
            })
            .finally(() => this.isLoading = false);

        this.getPayments();
    }

    getPayments() {

        this.api.payments(this.id)
            .then(result => this.payments = result);

    }

    recordPayment() {

        this.createPaymentService
            .show(this.recordPaymentParameters)
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

    get invoiceType(){
        throw new Error('Not implemented this method');
    }

    get recordPaymentParameters(){
        throw new Error('Not implemented this method');
    }

    printOfficialInvoice() {
        this.navigate('report.print', {key: 700}, {id: this.id});
    }

    printUnofficialInvoice() {
        this.navigate('report.print', {key: 703}, {id: this.id});
    }

    printPreInvoice() {
        this.navigate('report.print', {key: 704}, {id: this.id});
    }

    sendEmail() {

        this.sendInvoiceEmail.show({
            invoiceId: this.invoice.id,
            personId: this.invoice.detailAccountId
        });
    }

    printPaymentReceipt() {
        this.navigate('report.print', {key: 702}, {id: this.id});
    }
}

export default InvoiceViewBaseController;