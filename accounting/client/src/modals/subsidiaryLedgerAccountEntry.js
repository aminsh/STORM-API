import accModule from '../acc.module';

function subsidiaryLedgerAccountEntryModalController($scope, $uibModalInstance, $stateParams, $location,
                                                     dimensionCategoryApi,
                                                     generalLedgerAccountApi,
                                                     subsidiaryLedgerAccountApi,
                                                     logger, formService, data) {

    let isEditMode = $location.$$url.includes('edit'),
        generalLedgerAccountId = $stateParams.generalLedgerAccountId,
        id = $stateParams.id;

    $scope.errors = [];
    $scope.isEditMode = isEditMode;
    $scope.editMode = data.editMode;
    $scope.generalLedgerAccount = data.generalLedgerAccount;
    $scope.dimensionCategories = dimensionCategoryApi.getAllLookupSync().data;
    $scope.isSaving = false;

    $scope.subsidiaryLedgerAccount = {
        code: '',
        title: '',
        isBankAccount: false,
        hasDetailAccount: false,
        hasDimension1: false,
        hasDimension2: false,
        hasDimension3: false,
    };

    if (!isEditMode)
        generalLedgerAccountApi.getById(generalLedgerAccountId)
            .then(result => $scope.generalLedgerAccount = result);


    if (isEditMode)
        subsidiaryLedgerAccountApi.getById(id)
            .then(result => $scope.subsidiaryLedgerAccount = result);

    $scope.save = form => {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.errors.asEnumerable().removeAll();
        $scope.isSaving = true;

        if (isEditMode)
            subsidiaryLedgerAccountApi.update(
                $scope.subsidiaryLedgerAccount.id,
                $scope.subsidiaryLedgerAccount)
                .then(() => {
                    logger.success();
                    $uibModalInstance.close();
                })
                .catch(errors => $scope.errors = errors)
                .finally(() => $scope.isSaving = false);

        subsidiaryLedgerAccountApi.create(generalLedgerAccountId, $scope.subsidiaryLedgerAccount)
            .then(result => {
                logger.success();
                $scope.$close(result);
            })
            .catch(errors => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => $scope.$dismiss();

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




