import accModule from '../acc.module';

function journalAttachImageController($scope, $uibModalInstance, data, journalApi) {

    let journalId = data.id;
    let errors = $scope.errors = [];

    $scope.uploaded = (fileName)=> {
        journalApi.attachImage(journalId, {fileName: fileName})
            .then(()=> $uibModalInstance.close(fileName))
            .catch((err)=> errors = err);
    };

    $scope.close = ()=> $uibModalInstance.dismiss();
}

function journalAttachImageService(modalBase) {
    return modalBase({
        controller: journalAttachImageController,
        templateUrl: 'partials/modals/journalAttachImage.html'
    });
}

accModule
    .controller('journalAttachImageController', journalAttachImageController)
    .factory('journalAttachImageService', journalAttachImageService);
