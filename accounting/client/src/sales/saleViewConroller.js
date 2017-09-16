import InvoiceViewControllerBase from './invoiceViewBase';

class SaleViewController extends InvoiceViewControllerBase {
    constructor($scope,
                $state,
                $stateParams,
                navigate,
                logger,
                saleApi,
                createPaymentService,
                sendInvoiceEmail) {

        super($scope,
            $state,
            $stateParams,
            navigate,
            logger,
            saleApi,
            createPaymentService,
            sendInvoiceEmail);
    }
}

export default SaleViewController;