import accModule from '../acc.module';
import $ from 'jquery';

function journalPrintController($scope, journalApi) {

    let id = $routeParams.id;
    $scope.data = {};
    $scope.canShowReport = false;

    journalApi.getById(id)
        .then((result)=> {
            $scope.data = result;
            $scope.canShowReport = true;
        });

}

accModule.controller('journalPrintController', journalPrintController);

