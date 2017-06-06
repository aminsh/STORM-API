import accModule from '../acc.module';

function cashPaymentController($scope, $uibModalInstance,devConstants) {

    $scope.payment={"payment":"0","fund":""};

    $scope.fundDataSource = new kendo.data.DataSource({
        serverFiltering: true,
        //serverPaging: true,
        // pageSize: 10,
        transport: {
            read: {
                url: devConstants.urls.fund.getAll(),
                dataType: "json"
            },
        },
        schema: {
            data:'data',
            total:'total'
        }
    });

    $scope.close = () => $uibModalInstance.dismiss();
}

function cashPaymentService(modalBase) {
    return modalBase({
        controller: cashPaymentController,
        templateUrl: 'partials/sales/cashPayment.html'
    });
}

accModule
    .controller('cashPaymentController', cashPaymentController)
    .factory('cashPaymentService', cashPaymentService);
