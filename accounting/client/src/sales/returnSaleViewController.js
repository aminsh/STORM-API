import InvoiceViewBase from "./invoiceViewBase";

class ReturnSaleViewController extends InvoiceViewBase {
    constructor($scope,
                $state,
                $stateParams,
                navigate,
                logger,
                returnSaleApi,
                createPaymentService,
                sendInvoiceEmail) {

        super($scope,
            $state,
            $stateParams,
            navigate,
            logger,
            returnSaleApi,
            createPaymentService,
            sendInvoiceEmail);
    }

    get recordPaymentParameters(){
        return {
            amount: this.invoice.sumRemainder,
            receiveOrPay: 'pay'
        }
    }
}

export default ReturnSaleViewController;