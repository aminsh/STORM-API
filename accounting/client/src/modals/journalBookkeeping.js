import accModule from '../acc.module';

function journalBookkeepingController($scope, $uibModalInstance, formService,
                                      data, journalApi) {

    let journalId = data.id;

    $scope.errors = [];
    $scope.bookkeeping = {
        number: null,
        date: ''
    };

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (form.$invalid)
            return formService.setDirty(form);

        $scope.isSaving = true;

        journalApi.bookkeeping(journalId, $scope.bookkeeping)
            .then((result)=> $uibModalInstance.close())
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.close = ()=> $uibModalInstance.dismiss();
}

function journalBookkeepingService(modalBase) {
    return modalBase({
        controller: journalBookkeepingController,
        templateUrl: 'partials/modals/journalBookkeeping.html'
    });
}

accModule
    .controller('journalBookkeepingController', journalBookkeepingController)
    .factory('journalBookkeepingService', journalBookkeepingService);

