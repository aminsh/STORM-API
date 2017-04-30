import accModule from '../acc.module';

function writeChequeOnJournalLineEntryController($scope,
    chequeApi, chequeCategoryApi, data, $timeout,
    formService, $uibModalInstance, devConstants) {
    $scope.errors = [];
    $scope.cheque = {
        journalLineId: data.journalLineId,
        detailAccountDisplay: data.detailAccountDisplay,
        chequeId: null,
        amount: data.amount,
        date: data.date,
        description: data.description
    };

    $scope.openChequeCategories = [];
    $scope.selectedChequeCategory = false;
    $scope.hasOpenChequeCategories = true;

    chequeCategoryApi.getOpens(data.detailAccountId)
        .then(result => {
            $scope.openChequeCategories = result;
            $scope.hasOpenChequeCategories = result.length;
        });

    $scope.selectChequeCategory = cat => {
        $scope.selectedChequeCategory = cat;
        setWhiteChanges(cat.id);
    };

    $scope.isSaving = false;

    $scope.save = (form) => {
        if (!$scope.hasOpenChequeCategories)
            return;
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.isSaving = true;
        chequeApi.write($scope.cheque.chequeId, $scope.cheque)
            .then((result) => $uibModalInstance.close(result))
            .catch((result) => $scope.errors = result)
            .finally(() => $scope.isSaving = false);
    };

    $scope.close = () => $uibModalInstance.dismiss();
    $scope.whiteCheques = [];

    function setWhiteChanges(categoryId) {
        chequeApi.getAllwhites(categoryId)
            .then(result => $scope.whiteCheques = result.data);
    }
}

function writeChequeOnJournalLineEntryService(modalBase) {
    return modalBase({
        controller: writeChequeOnJournalLineEntryController,
        templateUrl: 'partials/modals/writeChequeOnJournalLineEntry.html'
    });
}

accModule
    .controller('writeChequeOnJournalLineEntryController', writeChequeOnJournalLineEntryController)
    .factory('writeChequeOnJournalLineEntryService', writeChequeOnJournalLineEntryService);