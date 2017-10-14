
function PaymentComponent() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            amount: '@',
            receiveOrPay:'@',
            onSave: '&'
        },
        templateUrl: 'partials/payment/payment.entry.template.html',
        controller: 'paymentController',
        controllerAs: 'model'
    }
}

export default PaymentComponent;