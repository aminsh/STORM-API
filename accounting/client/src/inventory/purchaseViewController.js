import InvoiceViewControllerBase from "../sales/invoiceViewBase";

class PurchaseViewController extends InvoiceViewControllerBase {

    constructor($scope,
                $state,
                $stateParams,
                navigate,
                logger,
                purchaseApi,
                createPaymentService,
                sendInvoiceEmail) {

        super($scope,
            $state,
            $stateParams,
            navigate,
            logger,
            purchaseApi,
            createPaymentService,
            sendInvoiceEmail);

        this.canShowPayment = false;
    }

    recordPayment() {
        this.canShowPayment = true;
    }

    savePayment(payment) {
        this.api.pay(this.id, payment)
            .then(() => {
                this.logger.success();
                this.getPayments();
                this.fetchInvoice();
                this.canShowPayment = false;
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isLoading = false);
    }

    get recordPaymentParameters() {
        return {
            amount: this.invoice.sumRemainder,
            receiveOrPay: 'pay'
        }
    }

    close() {
        this.$scope.$dismiss();
    }
}

export default PurchaseViewController;