import accModule from '../acc.module';

function chequesByCategoryModalController($scope,$uibModalInstance,data, devConstants, translate, navigate, $timeout) {

    $scope.gridOption = {
        columns: [
            {name: 'number', title: translate('Number'), type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date'},
            {name: 'amount', title: translate('Amount'), type: 'number', format: '{0:#,##}'}
        ],
        commands: [{
            title: translate('Print'),
            action: current => {
                $uibModalInstance.dismiss();
                $timeout(()=> navigate('chequePrint', {id: current.id}), 0);
            }
        }],
        readUrl:devConstants.urls.cheque.all(data.categoryId)
    };

    $scope.close = ()=> $uibModalInstance.dismiss();
}

function chequesByCategoryModalService(modalBase) {
    return modalBase({
        controller: chequesByCategoryModalController,
        templateUrl: 'partials/modals/chequesByCategory.html',
        size: 'lg'
    });
}

accModule
    .controller('chequesByCategoryModalController', chequesByCategoryModalController)
    .factory('chequesByCategoryModalService', chequesByCategoryModalService);


