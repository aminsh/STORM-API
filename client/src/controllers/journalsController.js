import accModule from '../acc.module';
import Collection from 'dev.collection';

function journalsController($scope, translate, journalApi, navigate, logger,
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
                width: '70px',
                template: `<i title="{{item.statusTitle}}" 
                            class="fa fa-{{item.statusIcon}}"
                            style="color: {{item.statusColor}};font-size: 20px"></i>`
            },
            {name: 'temporaryNumber', title: translate('Temporary number'), width: '100px', type: 'number'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '100px',},
            {name: 'number', title: translate('Number'), width: '100px', type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date', width: '100px',},
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
                    navigate('journalUpdate', {
                        id: current.id
                    });
                }
            }
        ],
        readUrl: journalApi.url.getAll,
        selectable: false,
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

            instance.generalLedgerAccounts = new Collection(filterData.generalLedgerAccounts)
                .asEnumerable()
                .select((g) => g.id)
                .toArray();

            instance.subsidiaryLedgerAccounts = new Collection(filterData.subsidiaryLedgerAccounts)
                .asEnumerable()
                .select((s) => s.id)
                .toArray();

            instance.detailAccounts = new Collection(filterData.detailAccounts)
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension1s = new Collection(filterData.dimension2s)
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension2s = new Collection(filterData.dimension2s)
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension3s = new Collection(filterData.dimension3s)
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.dimension4s = new Collection(filterData.dimension4s)
                .asEnumerable()
                .select((d) => d.id)
                .toArray();

            instance.chequeNumbers = new Collection(filterData.chequeNumbers)
                .asEnumerable()
                .select((c) => c.id)
                .toArray();


            return instance;
        }
    });