import accModule from '../acc.module';
import devConstants from '../localData/devConstants';

function generalLedgerAccountUpdateModalController($scope,
                                                   $uibModalInstance,
                                                   data,
                                                   generalLedgerAccountApi,
                                                   logger, formService) {

    $scope.errors = [];
    $scope.generalLedgerAccount = {
        title: '',
        code: '',
        postingType: null,
        balanceType: null,
        description: ''
    };

    generalLedgerAccountApi.getById(data.id)
        .then(function (result) {
            $scope.generalLedgerAccount = result;
        });

    $scope.isSaving = false;
    $scope.save = function (form) {

        if (form.$invalid) {
            formService.setDirty(form);
            return;
        }

        $scope.errors.removeAll();

        $scope.isSaving = true;

        generalLedgerAccountApi.update(data.id, $scope.generalLedgerAccount)
            .then(function (result) {
                logger.success();
                $uibModalInstance.close(result);
            })
            .catch(function (errors) {
                $scope.errors = errors;
            })
            .finally(()=> $scope.isSaving = false);
    };

    $scope.activate = function () {
        if ($scope.generalLedgerAccount.isActive)
            return;

        generalLedgerAccountApi.activate($scope.generalLedgerAccount.id)
            .then(function () {
                $scope.generalLedgerAccount.isActive = true;
                logger.success();
            })
            .catch(function () {
                $scope.errors = err.errors;
            })
    }

    $scope.deactivate = function () {
        if (!$scope.generalLedgerAccount.isActive)
            return;

        generalLedgerAccountApi.deactivate($scope.generalLedgerAccount.id)
            .then(function () {
                $scope.generalLedgerAccount.isActive = false;
                logger.success();
            })
            .catch(function () {
                $scope.errors = err.errors;
            })
    };

    $scope.close = ()=> $uibModalInstance.dismiss();

    $scope.accountPostingType = devConstants.enums.AccountPostingType();
    $scope.accountBalanceType = devConstants.enums.AccountBalanceType();
}

function generalLedgerAccountUpdateModalService(modalBase) {
    return modalBase({
        controller: generalLedgerAccountUpdateModalController,
        templateUrl: 'partials/modals/generalLedgerAccountUpdate.html'
    });
}

accModule
    .controller(
        'generalLedgerAccountUpdateModalController',
        generalLedgerAccountUpdateModalController)
    .factory(
        'generalLedgerAccountUpdateModalService',
        generalLedgerAccountUpdateModalService);

