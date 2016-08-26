import accModule from '../acc.module';

function journalLineCreateOrUpdateController($scope, $modalInstance, $timeout, formService, $q,
                                             journalLineApi, logger, constants, data) {

    let journalId = data.journalId;
    let id = data.id;
    let editMode = $scope.editMode = id == undefined ? 'create' : 'update';

    $scope.generalLedgerAccountShouldBeFocus = true;

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

    if (editMode == 'update')
        journalLineApi.getById(id)
            .then((result)=> {
                result.amount = 0;
                result.balanceType = '';

                if (result.creditor > 0) {
                    result.amount = result.creditor;
                    result.balanceType = 'creditor';
                }

                if (result.debtor > 0) {
                    result.amount = result.debtor;
                    result.balanceType = 'debtor';
                }

                $scope.journalLine = result
            });

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

        $scope.generalLedgerAccountShouldBeFocus = true;
    };

    $scope.isSaving = false;

    let save = (form)=> {
        let deferred = $q.defer();

        function execute() {
            if (form.$invalid) {
                formService.setDirty(form);
                deferred.reject();
                return;
            }

            $scope.isSaving = true;

            let journalLine = $scope.journalLine;

            let cmd = {
                generalLedgerAccountId: journalLine.generalLedgerAccountId,
                subsidiaryLedgerAccountId: journalLine.subsidiaryLedgerAccountId,
                detailAccountId: journalLine.detailAccountId,
                description: journalLine.description,
                amount: journalLine.amount,
                balanceType: journalLine.balanceType
            };

            cmd.dimensions = $scope.journalLine.dimensions
                .asEnumerable()
                .select(d=> {
                    return {
                        categoryId: d.categoryId,
                        id: d.id
                    }
                })
                .toArray();

            if (editMode == 'create')
                journalLineApi.create(journalId, cmd)
                    .then((result)=> {
                        deferred.resolve(result);
                        logger.success();
                    })
                    .catch((errors)=> {
                        $scope.errors = errors;
                        deferred.reject();
                    })
                    .finally(()=> {
                        $scope.isSaving = false;
                        deferred.resolve();
                    });

            if (editMode == 'update')
                journalLineApi.update(id, cmd)
                    .then(()=> {
                        deferred.resolve();
                        logger.success();
                    })
                    .catch((errors)=> {
                        $scope.errors = errors;
                        deferred.reject();
                    })
                    .finally(()=> $scope.isSaving = false);
        }

        $timeout(execute, 0);

        return deferred.promise;
    }

    $scope.saveAndNew = (form)=> {
        save(form)
            .then(()=> resetForm(form));
    };

    $scope.saveAndReturn = (form)=> {
        save(form)
            .then((result)=> $modalInstance.close(result));
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
                    canShow: ['Required', 'NotRequired'].asEnumerable().contains(dimensionStatus.status),
                    isRequired: dimensionStatus.status == 'Required',
                    categoryId: dimensionStatus.id,
                    categoryTitle: dimensionStatus.title,
                    dataSource: dimensionDataSource(dimensionStatus.id)
                }
            })
            .toArray();

        $scope.journalLine.detailAccount = {
            canShow: ['Required', 'NotRequired'].asEnumerable().contains(item.detailAccountAssignmentStatus),
            isRequired: item.detailAccountAssignmentStatus == 'Required'
        };
    };

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

    $scope.changeAmountBalance = ()=>
        $scope.journalLine.balanceType = $scope.journalLine.balanceType == 'debtor'
            ? 'creditor'
            : 'debtor';


    let getDimensionId = (categoryId)=> {
        let dimensions = $scope.journalLine.dimensions;

        if (dimensions == null)
            return null;

        if (!dimensions.asEnumerable().any(d=> d.categoryId == categoryId))
            return null;

        return dimensions.asEnumerable().single(d=> d.categoryId == categoryId).id;
    }

    $scope.close = ()=> $modalInstance.dismiss();
}

function journalLineCreateOrUpdateControllerModalService(modalBase) {
    return modalBase({
        controller: journalLineCreateOrUpdateController,
        templateUrl: 'partials/modals/journalLineCreateOrUpdate.html'
    });
}

accModule
    .controller('journalLineCreateController', journalLineCreateOrUpdateController)
    .factory('journalLineCreateControllerModalService', journalLineCreateOrUpdateControllerModalService);

accModule
    .controller('journalLineUpdateController', journalLineCreateOrUpdateController)
    .factory('journalLineUpdateControllerModalService', journalLineCreateOrUpdateControllerModalService);




