import accModule from "../acc.module";

function journalsController($scope, translate, journalApi, $state, logger, prompt, confirm,
                            navigate,
                            journalAdvancedSearchModalService,
                            journalsExtraFilterResolve,
                            journalTemplateService,
                            journalTemplateApi) {

    $scope.searchParameters = false;
    $scope.gridOption = {
        name: 'journals',
        columns: [
            {
                name: 'journalStatus',
                title: translate('Status'),
                type: 'journalStatus',
                width: '120px',
                template: `<i ng-if="item.journalStatus == 'Fixed'"
                            title="{{item.journalStatusDisplay}}" 
                            class="fa fa-lock fa-lg"></i>`
            },
            {name: 'number', title: translate('Number'), width: '120px', type: 'number'},
            {name: 'date', title: translate('Date'), type: 'date', width: '120px'},

            {
                name: 'description', title: translate('Journal description'), type: 'string', width: '40%',
                template: '<a ui-sref="journals.list.detail({id: item.id})" title="{{item.description}}">{{item.description}}</a>'
            },
            {
                name: 'sumDebtor',
                title: translate('Debtor'),
                type: 'number',
                width: '120px',
                template: '<span  style="font-weight: bold">{{item.sumDebtor|number}}</span>'
            },
            {
                name: 'sumCreditor',
                title: translate('Creditor'),
                type: 'number',
                width: '120px',
                template: '<span  style="font-weight: bold">{{item.sumCreditor|number}}</span>'
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                icon: 'fa fa-edit text-success',
                canShow: item => item.journalStatus != 'Fixed',
                action: function (current) {
                    $state.go('^.edit', {
                        id: current.id
                    });
                }
            },
            {
                title: translate('As a journal template'),
                icon: 'fa fa-file-o text-success',
                action: current => {
                    prompt({
                        title: translate('Copy to journal template'),
                        text: translate('Enter Title of journal template'),
                    }).then((inputValue) => {
                        journalTemplateApi.create({journalId: current.id, title: inputValue})
                            .then(() => logger.success());
                    });
                }
            },
            {
                title: translate('Copy journal'),
                icon: 'fa fa-copy text-success',
                action: current => {
                    confirm(
                        translate('Are you sure ?'),
                        translate('Copy journal')
                    ).then(() => {
                        journalApi.copy(current.id)
                            .then(result => {
                                logger.success();
                                $state.go('^.edit', {id: result.id});
                            });
                    });
                }
            },
            {
                title: translate('Print'),
                icon: 'fa fa-print text-success',
                action: current => {
                    let reportParam = {"minNumber": current.number, "maxNumber": current.number};

                    navigate(
                        'report.print',
                        {key: 100},
                        reportParam);
                }
            },
            {
                title: translate('Remove'),
                icon: 'fa fa-trash text-danger',
                canShow: item => item.journalStatus != 'Fixed',
                action: current => {
                    confirm(
                        translate('Are you sure ?'),
                        translate('Remove journal')
                    ).then(() => {
                        journalApi.remove(current.id)
                            .then(result => {
                                logger.success();
                                $scope.gridOption.refresh();
                            });
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
        sort: [
            {dir: 'desc', field: 'number'}
        ],
        resolveExtraFilter: journalsExtraFilterResolve,
        setExtraFilter: (extra) => {
            $scope.searchParameters = extra;
        }
    };

    $scope.$on('fiscal-period-changed', () => $scope.gridOption.refresh());

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

    $scope.journalTemplate = () => {
        journalTemplateService.show();
    };
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