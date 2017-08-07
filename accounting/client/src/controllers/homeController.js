import accModule from '../acc.module';

function homeController($scope, translate, purchaseApi, saleApi, bankAndFundApi) {

    fetch();

    $scope.$on('fiscal-period-changed', fetch);

    $scope.purchaseInfo = {
        total: 0,
        sumOfPaid: 0,
        sumOfRemain: 0
    };

    $scope.saleInfo = {
        total: 0,
        sumOfPaid: 0,
        sumOfRemain: 0
    };
    function fetch() {

        purchaseApi.summary().then(result => {
            $scope.purchaseInfo.sumOfPaid = result.sumPaidAmount;
            $scope.purchaseInfo.sumOfRemain = result.sumRemainder;
            $scope.purchaseInfo.total = result.total;
        });

        saleApi.summary().then(result => {
            $scope.data = result;
            $scope.saleInfo.sumOfPaid = result.sumPaidAmount;
            $scope.saleInfo.sumOfRemain = result.sumRemainder;
            $scope.saleInfo.total = result.total;
        });

        bankAndFundApi.summary().then(result => {
            $scope.bankAndFundInfos = result;
        });

        saleApi.summaryByProduct().then(result => {
            let items = result.asEnumerable();
            let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

            $scope.dounatlabels = items.select(item => item.productTitle).toArray();
            $scope.dounatlabelForDisplay = colors.asEnumerable()
                .take($scope.dounatlabels.length)
                .select(c => ({color: c, label: $scope.dounatlabels[colors.indexOf(c)]}))
                .toArray();
            $scope.dounatdata = items.select(item => parseInt(item.total)).toArray();
        });

        saleApi.summaryByMonth().then(result => {
            let items = result.asEnumerable();
            let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

            $scope.series = [translate('Total Sales Price'), translate('Sales Quantity')];

            $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];

            $scope.options = {
                responsive: true,
                legend: {display: true},
                maintainAspectRatio:false,
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        },
                        {
                            id: 'y-axis-2',
                            type: 'linear',
                            display: true,
                            position: 'right'
                        }
                    ]
                }
            };

            $scope.labels = items.select(item => item.monthName).toArray();

            $scope.labelForDisplay = colors.asEnumerable()
                .take($scope.labels.length)
                .select(c => ({color: c, label: $scope.labels[colors.indexOf(c)]}))
                .toArray();

            $scope.data = [items.select(item => parseInt(item.totalPrice)).toArray(),items.select(item => parseInt(item.total)).toArray()];
        });

    }
}

accModule.controller('homeController', homeController);