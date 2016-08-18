import accModule from '../acc.module';

function journalLineUpdateController($scope, navigate, logger, journalLineApi, $routeParams,
                                     constants, formService, $q, $timeout) {

    let id = $routeParams.id;

    $scope.errors = [];

    $scope.journalLine = {
        generalLedgerAccountId: null,
        subsidiaryLedgerAccountId: null,
        detailAccountId: null,
        dimensions: [],
        description: '',
        amount: null,
        balanceType: ''
    };


    let resetForm = (form)=> {

        $scope.journalLine = {
            generalLedgerAccountId: null,
            subsidiaryLedgerAccount: null,
            detailAccountId: null,
            description: '',
            amount: null,
            balanceType: ''
        };

        $timeout(()=> formService.setClean(form), 100);
    };

    $scope.isSaving = false;

    let save = (form)=> {
        let deferred = $q.defer();

        if (form.$invalid) {
            formService.setDirty(form);
            return;
        }

        $scope.isSaving = true;

        let journalLine = $scope.journalLine;

        let cmd = {
            generalLedgerAccountId: journalLine.generalLedgerAccountId,
            subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccount.id,
            detailAccountId: journalLine.detailAccountId,
            description: journalLine.description,
            amount: journalLine.amount,
            balanceType: journalLine.balanceType
        };

        cmd.dimensions = $scope.journalLine.subsidiaryLedgerAccount.dimensions
            .asEnumerable()
            .select(d=> {
                return {
                    categoryId: d.categoryId,
                    id: d.id
                }
            })
            .toArray();

        journalLineApi.create(journalId, cmd)
            .then(()=> {
                deferred.resolve();
                logger.success();
            })
            .catch((errors)=> $scope.errors = errors)
            .finally(()=> $scope.isSaving = false);

        return deferred.promise;
    }

    $scope.saveAndNew = (form)=> {
        save(form)
            .then(()=> resetForm(form));
    };

    $scope.saveAndReturn = (form)=> {
        save(form)
            .then(()=> navigate('journalUpdate', {id: journalId}));
    }

    $scope.generalLedgerAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.generalLedgerAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    }

    $scope.generalLedgerAccountOnChange = ()=> {
        $scope.journalLine.subsidiaryLedgerAccountId = null;

        $scope.journalLine.dimensions = [];
        $scope.journalLine.detailAccount = {
            canShow: false,
            isRequired: false
        }
    }

    $scope.subsidiaryLedgerAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: (filter)=> {
                    let generalLegerAccountId = filter.filter.filters
                        .asEnumerable()
                        .first(f => f.field == 'generalLedgerAccountId')
                        .value;

                    return constants.urls
                        .subsidiaryLedgerAccount
                        .allByGeneralLedgerAccount(generalLegerAccountId)
                }
            }
        },
        schema: {
            data: 'data'
        }
    }

    $scope.subsidiaryLedgerAccountDataBound = (e)=> e.sender.trigger('change');

    $scope.detailAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: constants.urls.detailAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    let dimensionDataSource = (categoryId)=> {
        return {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.urls.dimension.allByCategory(categoryId)
                }
            },
            schema: {
                data: 'data'
            }
        }
    }

    let getDimensionId = (categoryId)=> {
        let dimensions = $scope.journalLine.dimensions;

        if (dimensions == null)
            return null;

        if (!dimensions.asEnumerable().any(d=> d.categoryId == categoryId))
            return null;

        return dimensions.asEnumerable().single(d=> d.categoryId == categoryId).id;
    }

    $scope.changeAmountBalance = ()=>
        $scope.journalLine.balanceType = $scope.journalLine.balanceType == 'debtor'
            ? 'creditor'
            : 'debtor';

    $scope.subsidiaryLedgerAccountSelect = (e)=> {
        let item = e.sender.dataItem();

        if (!item) {
            $scope.journalLine.dimensions = [];
            $scope.journalLine.detailAccount = {
                canShow: false,
                isRequired: false
            }

            return;
        }

        $scope.journalLine.dimensions = Array.from(item.dimensionAssignmentStatus)
            .asEnumerable()
            .select(dimensionStatus=> {
                return {
                    id: getDimensionId(dimensionStatus.id),
                    canShow: constants.enums.AssignmentStatus().getKeys('Required', 'NotRequired')
                        .asEnumerable()
                        .contains(dimensionStatus.status),
                    isRequired: dimensionStatus.status == constants.enums.AssignmentStatus().getKey('Required'),
                    categoryId: dimensionStatus.id,
                    categoryTitle: dimensionStatus.title,
                    dataSource: dimensionDataSource(dimensionStatus.id)
                }
            })
            .toArray();

        $scope.journalLine.detailAccount = {
            canShow: constants.enums.AssignmentStatus()
                .getKeys('Required', 'NotRequired')
                .asEnumerable()
                .contains(item.detailAccountAssignmentStatus),
            isRequired: item.detailAccountAssignmentStatus == constants.enums.AssignmentStatus().getKey('Required')
        };
    };
}

//accModule.controller('journalLineUpdateController', journalLineUpdateController);
