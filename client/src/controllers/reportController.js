import Collection from 'dev.collection';

export default function ($scope, devConstants) {

    $scope.reports = devConstants.reports;

    $scope.selectedReport = false;

    $scope.select = report => $scope.selectedReport = report;

    $scope.tabs = [];

    $scope.addTab = ()=> {
        $scope.tabs.push({title: $scope.selectedReport.text});
    };

    $scope.closeTag = tab => {
        Collection.remove($scope.tabs, tab);
    };

    $scope.data = [];
}

