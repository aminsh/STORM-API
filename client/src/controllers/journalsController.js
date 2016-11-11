import accModule from '../acc.module';

function journalsController($scope, translate, journalApi, navigate, logger,
                            journalCreateModalControllerService,
                            journalAdvancedSearchModalService,
                            journalsExtraFilterResolve) {

    $scope.searchParameters = false;

    $scope.gridOption = {
        name: 'journals',
        columns: [
            {
                name: 'journalStatus',
                title: translate('Status'),
                type: 'journalStatus',
                width: '70px',
                filterable: false,
                template: `<i title="#: data.statusTitle #" class="glyphicon glyphicon-#: data.statusIcon #"
                            style="color: #: data.statusColor #;font-size: 20px"></i>`
            },
            {name: 'temporaryNumber', title: translate('Temporary number'), width: '100px', type: 'number'},
            {name: 'temporaryDate', title: translate('Temporary date'), type: 'date', width: '100px',},
            {name: 'number', title: translate('Number'), width: '100px', type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date', width: '100px',},
            {
                name: 'description', title: translate('Description'), type: 'string', width: '30%',
                template: '<span title="${data.description}">${data.description}</span>'
            },
            {name: 'createdBy', title: translate('User'), width: '100px', type: 'string'}
            /*{name: 'sumDebtor', title: translate('sum debtor'), type: 'number', format: '{0:#,##}'},
             {
             name: 'sumCreditor',
             title: translate('sum creditor'),
             type: 'number',
             format: '{0:#,##}'
             },*/
        ],
        commands: [
            {
                title: translate('Edit'),
                action: function (current) {
                    navigate('journalUpdate', {
                        id: current.id
                    });
                }
            }
        ],
        readUrl: journalApi.url.getAll,
        selectable: 'multiple cell',
        dataMapper: (result) => {
            let data = result.data.asEnumerable().select(d=> {

                d.statusTitle = d.journalStatusDisplay;
                if (d.isInComplete) {
                    d.statusIcon = 'exclamation-sign';
                    d.statusColor = 'red';
                    d.statusTitle = translate('InComplete journal');
                    return d;
                }

                if (d.journalStatus == 'BookKeeped') {
                    d.statusIcon = 'ok-circle';
                    d.statusColor = 'green';
                }

                if (d.journalStatus == 'Fixed') {
                    d.statusIcon = 'lock';
                    d.statusColor = 'blue';
                }

                return d;
            }).toArray();

            return data;
        },
        resolveExtraFilter: journalsExtraFilterResolve,
        setExtraFilter: (extra)=> {
            $scope.searchParameters = extra;

            if (!$scope.$$phase)
                $scope.$apply();
        }
    };

    $scope.create = ()=> {
        journalCreateModalControllerService.show()
            .then((result)=> {
                logger.success();
                navigate('journalUpdate', {
                    id: result.id
                });
            });
    };

    $scope.advancedSearch = ()=> {
        journalAdvancedSearchModalService.show()
            .then((result)=> {
                $scope.searchParameters = result;

                $scope.$broadcast('{0}/execute-advanced-search'.format($scope.gridOption.name),
                    result.resolve(result.data));
            });
    };

    $scope.removeParameters = ()=> {
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
    .factory('journalsExtraFilterResolve', ()=> {
        return function (filterData) {
            if (!filterData) return null;

            let instance = angular.extend({}, filterData);

            instance.generalLedgerAccounts = filterData.generalLedgerAccounts
                .asEnumerable()
                .select((g)=> g.id)
                .toArray();

            instance.subsidiaryLedgerAccounts = filterData.subsidiaryLedgerAccounts
                .asEnumerable()
                .select((s)=> s.id)
                .toArray();

            instance.detailAccounts = filterData.detailAccounts
                .asEnumerable()
                .select((d)=> d.id)
                .toArray();

            instance.dimension1s = filterData.dimension2s
                .asEnumerable()
                .select((d)=> d.id)
                .toArray();

            instance.dimension2s = filterData.dimension2s
                .asEnumerable()
                .select((d)=> d.id)
                .toArray();

            instance.dimension3s = filterData.dimension3s
                .asEnumerable()
                .select((d)=> d.id)
                .toArray();

            instance.dimension4s = filterData.dimension4s
                .asEnumerable()
                .select((d)=> d.id)
                .toArray();

            instance.chequeNumbers = filterData.chequeNumbers
                .asEnumerable()
                .select((c)=> c.id)
                .toArray();


            return instance;
        }
    });