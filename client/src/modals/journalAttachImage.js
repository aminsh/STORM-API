import accModule from '../acc.module';

function journalAttachImageController($scope, $modalInstance, data, journalApi) {

    let journalId = data.id;
    let errors = $scope.errors = [];

    $scope.uploaded = (fileName)=> {
        journalApi.attachImage(journalId, {fileName: fileName})
            .then(()=> $modalInstance.close(fileName))
            .catch((err)=> errors = err);
    };

    $scope.close = ()=> $modalInstance.dismiss();
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
