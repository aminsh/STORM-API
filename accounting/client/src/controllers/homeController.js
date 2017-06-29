import accModule from '../acc.module';

function homeController($scope, translate, purchaseApi, salesInvoiceApi, bankAndFundApi) {

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


    // $scope.months = [];
    //
    // $scope.series = [translate('Price'), translate('Quantity')];
    //
    // $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];
    //
    // $scope.options = {
    //     responsive: true,
    //     maintainAspectRatio:false,
    //     scales: {
    //         yAxes: [
    //             {
    //                 id: 'y-axis-1',
    //                 type: 'linear',
    //                 display: true,
    //                 position: 'left'
    //             },
    //             {
    //                 id: 'y-axis-2',
    //                 type: 'linear',
    //                 display: true,
    //                 position: 'right'
    //             }
    //         ]
    //     }
    // };
    //
    // $scope.data = [];
    //
    // $scope.labels = [];

    function fetch() {
        // journalApi.getGroupedByMouth()
        //     .then(result => {
        //         let items = result.data.asEnumerable();
        //
        //         let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
        //
        //         $scope.labels = items.select(item => item.monthName).toArray();
        //
        //         $scope.labelForDisplay = colors.asEnumerable()
        //             .take($scope.labels.length)
        //             .select(c => ({color: c, label: $scope.labels[colors.indexOf(c)]}))
        //             .toArray();
        //
        //        // $scope.data = items.select(item => parseInt(item.count)).toArray();
        //     });
        //
        // journalApi.incomesAndOutcomes()
        //     .then(result => {
        //         let items = result.asEnumerable()
        //
        //         let incomes = items
        //             .where(item => item.amountType == 'income')
        //             .select(item => item.amount)
        //             .toArray();
        //
        //         let outcomes = items
        //             .where(item => item.amountType == 'outcome')
        //             .select(item => item.amount)
        //             .toArray();
        //
        //         $scope.incomeAndOutcomes = [
        //             incomes, outcomes
        //         ];
        //
        //         $scope.months = items
        //             .distinct(item => item.monthName)
        //             .select(item => item.monthName)
        //             .toArray();
        //
        //         let income = incomes.asEnumerable().sum(),
        //             outcome = outcomes.asEnumerable().sum(),
        //             total = income + outcome,
        //             incomePercent = (income * 100) / total,
        //             outcomePercent = (outcome * 100) / total;
        //
        //         $scope.totalIncomeAndOutcome = {income, outcome, incomePercent, outcomePercent};
        //     });
        //
        // journalApi.getTotalInfo().then(result => $scope.totalInfo = result);

        purchaseApi.summary().then(result => {
            console.log(result);
            $scope.purchaseInfo.sumOfPaid = result.sumPaidAmount;
            $scope.purchaseInfo.sumOfRemain = result.sumRemainder;
            $scope.purchaseInfo.total = result.total;
        });

        salesInvoiceApi.summary().then(result => {
            console.log(result);
            $scope.data = result;
            $scope.saleInfo.sumOfPaid = result.sumPaidAmount;
            $scope.saleInfo.sumOfRemain = result.sumRemainder;
            $scope.saleInfo.total = result.total;
        });

        bankAndFundApi.summary().then(result => {
            $scope.bankAndFundInfos = result;
        });

        salesInvoiceApi.summaryByProduct().then(result => {
            let items = result.asEnumerable();
            let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

            $scope.dounatlabels = items.select(item => item.productTitle).toArray();
            $scope.dounatlabelForDisplay = colors.asEnumerable()
                .take($scope.dounatlabels.length)
                .select(c => ({color: c, label: $scope.dounatlabels[colors.indexOf(c)]}))
                .toArray();
            $scope.dounatdata = items.select(item => parseInt(item.total)).toArray();
        });

        salesInvoiceApi.summaryByMonth().then(result => {
            console.log(result);
            let items = result.asEnumerable();
            let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

            $scope.series = [translate('Total Sales Price'), translate('Sales Quantity')];

            $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];

            $scope.options = {
                responsive: true,
                legend: {display: true},
                maintainAspectRatio:false,
                scaleLabel: ((label)=>{
                    console.log(label);
                    return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }),
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