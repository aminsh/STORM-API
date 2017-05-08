import accModule from '../acc.module';

function homeController($scope, journalApi, translate) {

    fetch();

    $scope.$on('fiscal-period-changed', fetch);

    $scope.incomeAndOutcomes = [];
    $scope.months = [];

    $scope.series = [translate('Income'), translate('Outcome')];

    $scope.datasetOverride = [{yAxisID: 'y-axis-1'}, {yAxisID: 'y-axis-2'}];

    $scope.options = {
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

    $scope.data = [];
    $scope.labels = [];

    function fetch() {
        journalApi.getGroupedByMouth()
            .then(result => {
                let items = result.data.asEnumerable();

                let colors = ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
                $scope.labels = items.select(item => item.monthName).toArray();

                $scope.labelForDisplay = colors.asEnumerable()
                    .take($scope.labels.length)
                    .select(c => ({color: c, label: $scope.labels[colors.indexOf(c)]}))
                    .toArray();

                $scope.data = items.select(item => parseInt(item.count)).toArray();
            });

        journalApi.incomesAndOutcomes()
            .then(result => {
                let items = result.asEnumerable()

                let incomes = items
                    .where(item => item.amountType == 'income')
                    .select(item => item.amount)
                    .toArray();

                let outcomes = items
                    .where(item => item.amountType == 'outcome')
                    .select(item => item.amount)
                    .toArray();

                $scope.incomeAndOutcomes = [
                    incomes, outcomes
                ];

                $scope.months = items
                    .distinct(item => item.monthName)
                    .select(item => item.monthName)
                    .toArray();

                let income = incomes.asEnumerable().sum(),
                    outcome = outcomes.asEnumerable().sum(),
                    total = income + outcome,
                    incomePercent = (income * 100) / total,
                    outcomePercent = (outcome * 100) / total;

                $scope.totalIncomeAndOutcome = {income, outcome, incomePercent, outcomePercent};
            });

        journalApi.getTotalInfo().then(result => $scope.totalInfo = result);
    }
}

accModule.controller('homeController', homeController);