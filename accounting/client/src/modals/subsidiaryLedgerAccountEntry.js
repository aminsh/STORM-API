import accModule from '../acc.module';

function subsidiaryLedgerAccountEntryModalController($scope, $uibModalInstance,
                                                     dimensionCategoryApi, subsidiaryLedgerAccountApi,
                                                     logger, formService, data, devConstants) {

    $scope.errors = [];
    $scope.editMode = data.editMode;
    $scope.generalLedgerAccount = data.generalLedgerAccount;
    $scope.assignmentStatus = devConstants.enums.AssignmentStatus().data;

    $scope.subsidiaryLedgerAccount = {
        code: '',
        title: '',
        detailAccountAssignmentStatus: null,
        isBankAccount: false,
        dimension1AssignmentStatus: null,
        dimension2AssignmentStatus: null,
        dimension3AssignmentStatus: null,
    };

    if (data.editMode == 'edit')
        subsidiaryLedgerAccountApi.getById(data.subsidiaryLedgerAccountId)
            .then(result => $scope.subsidiaryLedgerAccount = result);

    $scope.dimensionCategories = [];

    dimensionCategoryApi.getAll()
        .then(result => $scope.dimensionCategories = result.data);

    $scope.isSaving = false;

    $scope.save = form => {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.removeAll();
        $scope.isSaving = true;

        if (data.editMode == 'edit')
            subsidiaryLedgerAccountApi.update(
                $scope.subsidiaryLedgerAccount.id,
                $scope.subsidiaryLedgerAccount)
                .then(() => {
                    logger.success();
                    $modalInstance.close();
                })
                .catch(errors => $scope.errors = errors)
                .finally(() => $scope.isSaving = false);

        subsidiaryLedgerAccountApi.create(
            data.generalLedgerAccount.id,
            $scope.subsidiaryLedgerAccount)
            .then(result => {
                logger.success();
                $modalInstance.close(result);
            })
            .catch(errors => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => $modalInstance.dismiss();

}

function subsidiaryLedgerAccountEntryModalService(modalBase) {
    return modalBase({
        controller: subsidiaryLedgerAccountEntryModalController,
        templateUrl: 'partials/modals/subsidiaryLedgerAccountEntry.html'
    });
}

accModule
    .controller('subsidiaryLedgerAccountEntryModalController', subsidiaryLedgerAccountEntryModalController)
    .factory('subsidiaryLedgerAccountEntryModalService', subsidiaryLedgerAccountEntryModalService);




