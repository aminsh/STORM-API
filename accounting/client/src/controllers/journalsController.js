import accModule from '../acc.module';

function journalsController($scope, translate, journalApi, $state, logger,
                            journalCreateModalControllerService,
                            journalAdvancedSearchModalService,
                            journalsExtraFilterResolve) {

    $scope.searchParameters = false;
    []

    $scope.gridOption = {
        name: 'journals',
        columns: [
            {
                name: 'journalStatus',
                title: translate('Status'),
                type: 'journalStatus',
                width: '120px',
                template: `<i title="{{item.statusTitle}}" 
                            class="fa fa-{{item.statusIcon}}"
                            style="color: {{item.statusColor}};"></i>`
            },
            {name: 'temporaryNumber', title: translate('Number'), width: '120px', type: 'number'},
            {name: 'temporaryDate', title: translate('Date'), type: 'date', width: '120px',},
           /* {name: 'number', title: translate('Number'), width: '100px', type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date', width: '100px',},*/
            {
                name: 'description', title: translate('Description'), type: 'string', width: '30%',
                template: '<span title="{{item.description}}">{{item.description}}</span>'
            },
            {name: 'createdBy', title: translate('User'), width: '100px', type: 'string'}
        ],
        commands: [
            {
                title: translate('Edit'),
                icon: 'fa fa-edit',
                action: function (current) {
                    $state.go('^.edit', {
                        id: current.id
                    });
                }
            }
        ],
        readUrl: journalApi.url.getAll,
        mapper: (d) => {
            d.statusTitle = d.journalStatusDisplay;
            if (d.isInComplete) {
                d.statusIcon = 'warning';
                d.statusColor = 'red';
                d.statusTitle = translate('InComplete journal');
            }
            else {
                if (d.journalStatus == 'Fixed') {
                    d.statusIcon = 'lock';
                    d.statusColor = 'blue';
                } else {
                    d.statusIcon = 'check';
                    d.statusColor = 'green';
                }
            }
        },
        resolveExtraFilter: journalsExtraFilterResolve,
        setExtraFilter: (extra) => {
            $scope.searchParameters = extra;
        }
    };

    $scope.create = () => {
        journalCreateModalControllerService.show()
            .then((result) => {
                logger.success();
                navigate('journalUpdate', {
                    id: result.id
                });
            });
    };

    $scope.advancedSearch = () => {
        journalAdvancedSearchModalService.show()
            .then((result) => {
                $scope.searchParameters = result;

                $scope.$broadcast('{0}/execute-advanced-search'.format($scope.gridOption.name),
                    result.resolve(result.data));
            });
    };

    $scope.removeParameters = () => {
        $scope.searchParameters = false;
        $scope.$broadcast('{0}/execute-advanced-search'
            .format($scope.gridOption.name), null);
    };

    $scope.$on('$routeChangeStart', (next, current) => {
        $scope.gridOption.saveState($scope.searchParameters);
    });
}

accModule
    .controller('journalsController', journalsController)
    .factory('journalsExtraFilterResolve', () => {
        return function (filterData) {
            if (!filterData) return null;

            let instance = angular.extend({}, filterData);

            instance.generalLedgerAccounts = filterData.generalLedgerAccounts
                .asEnumerable()
                .select((g) => g.id)
                .toArray();

            instance.subsidiaryLedgerAccounts = filterData.subsidiaryLedgerAccounts
                .asEnumerable()
                .select((s) => s.id)
                .toArray();

            instance.detailAccounts = filterData.detailAccounts
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension1s = filterData.dimension2s
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension2s = filterData.dimension2s
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension3s = filterData.dimension3s
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension4s = filterData.dimension4s
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.chequeNumbers = filterData.chequeNumbers
                .asEnumerable()
                .select((c) => c.id)
                .toArray();


            return instance;
        }
    });