import accModule from '../acc.module';

function formService() {

    function setDirty(form) {
        angular.forEach(form.$error, function (type) {
            angular.forEach(type, function (field) {
                field.$setDirty();
            });
        });
        return form;
    }

    function setClean(form) {
        angular.forEach(form.$error, function (type) {
            angular.forEach(type, function (field) {
                field.$setPristine();
            });
        });
    }

    return {
        setDirty: setDirty,
        setClean: setClean
    }
}

accModule.service('formService', formService);