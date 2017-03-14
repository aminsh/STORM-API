import accModule from '../acc.module';
import $ from 'jquery';

function journalPrintController($scope, $routeParams, journalApi) {

    let id = $routeParams.id;
    $scope.data = {};
    $scope.canShowReport = false;

    journalApi.getJournalReportJson(id)
        .then((result)=> {
            $scope.data = result;
            $scope.canShowReport = true;
        });

}

accModule.controller('journalPrintController', journalPrintController);

