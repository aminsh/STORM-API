import accModule from '../acc.module';
import Collection from 'dev.collection';

function homeController($scope, currentService, navigate, journalApi, translate) {

    let current = currentService.get();

    if (!current.fiscalPeriod)
        return navigate('createFiscalPeriod');

    $scope.select = c => {
        var x = c;
        console.log(c);
    };

    $scope.save = ()=> $scope.isWaiting = !$scope.isWaiting;

    journalApi.getGroupedByMouth()
        .then(result => {
            let items = new Collection(result.data).asEnumerable();

            let colors = [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];
            $scope.labels = items.select(item => item.monthName).toArray();

            $scope.labelForDisplay = new Collection(colors).asEnumerable()
                .take($scope.labels.length)
                .select(c => ({color: c, label: $scope.labels[colors.indexOf(c)]}))
                .toArray();

            $scope.data = items.select(item => parseInt(item.count)).toArray();
        });

    journalApi.incomesAndOutcomes()
        .then(result => {
            let items = new Collection(result).asEnumerable()

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

            $scope.months =items
                .distinct(item => item.monthName)
                .select(item => item.monthName)
                .toArray();

        });

    $scope.incomeAndOutcomes = [];
    $scope.months = [];

    $scope.series = [translate('Income'), translate('Outcome')];

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];

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



    /* $scope.data = [
     {
     row: 1,
     da: 1,
     sla: 100,
     gla: 131,
     article: 'بابت هزینه ایاب و ذهاب',
     debtor: 10000,
     creditor: 0
     },
     {
     row: 1,
     da: 2,
     sla: 100,
     gla: 131,
     article: 'بابت هزینه ایاب و ذهاب',
     debtor: 10000,
     creditor: 0
     },
     {
     row: 1,
     da: 3,
     sla: 100,
     gla: 131,
     article: 'بابت هزینه ایاب و ذهاب',
     debtor: 10000,
     creditor: 0
     }
     ];

     let detailAccountDataSource = {
     type: "json",
     serverFiltering: true,
     transport: {
     read: {
     url: devConstants.urls.detailAccount.all()
     }
     },
     schema: {
     data: 'data'
     }
     };

     let articleEditor= `<dev-tag-editor ng-model="item.article"></dev-tag-editor>`;

     $scope.columns = [
     {name: 'row', title: '#', editTemplate: '{{item.row}}'},
     {
     name: 'da',
     title: 'تفصیل',
     editTemplate: `<dev-tag-combo-box
     ng-change="changeValue(item.da)"
     name="generalLedgerAccountId"
     id="generalLedgerAccountId"
     k-placeholder="{{'Select ...'|translate}}"
     k-data-value-field="id"
     k-data-text-field="display"
     k-data-source="column.dataSource"
     k-on-change="generalLedgerAccountOnChange"
     ng-model="item.da"
     required></dev-tag-combo-box>`,
     dataSource: detailAccountDataSource
     },
     {name: 'sla', title: 'معین',
     editTemplate: '<input style="height: 30px" type="text" class="form-control" ng-model="item.sla">'},
     {name: 'gla', title: 'کل',
     editTemplate: '<input style="height: 30px" type="text" class="form-control" ng-model="item.gla">'},
     {name: 'article', title: 'آرتیکل',
     editTemplate: `<input
     type="text"
     required
     class="form-control"
     name="article"
     ng-model="item.article"
     popover="{{item.article}}"
     popover-trigger="focus"
     popover-placement="bottom"
     tooltip="{{'This field is required'| translate}}"
     tooltip-placement="bottom"
     tooltip-trigger="mouseenter"
     tooltip-enable="subForm.article.$invalid"/>`
     },
     {name: 'debtor', title: 'بدهکار',
     editTemplate: `<dev-tag-numeric
     style="height: 30px"
     ng-model="item.debtor"
     popover="{{item.debtor|number}}"
     popover-trigger="focus" class="form-control"
     popover-placement="bottom"></dev-tag-numeric>`},
     {name: 'creditor', title: 'بستانکار',
     editTemplate: `<dev-tag-numeric
     style="height: 30px"
     ng-model="item.creditor"
     popover="{{item.creditor|number}}"
     popover-trigger="focus" class="form-control"
     popover-placement="bottom"></dev-tag-numeric>`},

     ];

     $scope.defaultItem = {
     row: 1,
     da: null,
     sla: null,
     gla: null,
     article: '',
     debtor: 0,
     creditor: 0
     };*/
}

accModule.controller('homeController', homeController);