import accModule from '../acc.module';

function writeChequeOnJournalLineEntryController($scope,
                                                 chequeApi, chequeCategoryApi, data, $timeout,
                                                 formService, $modalInstance, devConstants) {
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
        .then((result)=> {
            $scope.openChequeCategories = result;
            if (result.length == 0)
                $scope.hasOpenChequeCategories = false;
        });

    $scope.selectChequeCategory = (cat)=> {
        $scope.selectedChequeCategory = false;
        $scope.whiteChequesDataSource.transport.read.url = devConstants.urls.cheque.allwhites(cat.id);

        $timeout(()=> $scope.selectedChequeCategory = cat, 1);
    };

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (!$scope.hasOpenChequeCategories)
            return;
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.isSaving = true;
        chequeApi.write($scope.cheque.chequeId, $scope.cheque)
            .then((result)=> $modalInstance.close(result))
            .catch((result)=> $scope.errors = result)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $modalInstance.dismiss();

    $scope.whiteChequesDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: null
            }
        },
        schema: {
            data: 'data'
        }
    };
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