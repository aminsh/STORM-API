import accModule from '../acc.module';
import Collection from 'dev.collection';

function journalLineCreateOrUpdateController($scope, $modalInstance, $timeout, formService, $q,
                                             journalLineApi, dimensionCategoryApi, logger, devConstants, data) {

    let journalId = data.journalId;
    let id = data.id;
    let editMode = $scope.editMode = id == undefined ? 'create' : 'update';

    $scope.generalLedgerAccountShouldBeFocus = true;

    $scope.errors = [];
    $scope.dimensionCategories = [];
    $scope.journalLine = {
        generalLedgerAccountId: null,
        subsidiaryLedgerAccountId: null,
        detailAccountId: null,
        dimension1Id: null,
        dimension2Id: null,
        dimension3Id: null,
        article: '',
        amount: null,
        balanceType: ''
    };

    $scope.detailAccountDataSource = {
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

    $scope.dimension1DataSource = null;
    $scope.dimension2DataSource = null;
    $scope.dimension3DataSource = null;

    dimensionCategoryApi.getAll()
        .then((result) => {
            let cats = result.data;
            $scope.dimensionCategories = cats;

            $scope.dimension1DataSource = dimensionDataSourceFactory(cats[0].id);
            $scope.dimension2DataSource = dimensionDataSourceFactory(cats[1].id);
            $scope.dimension3DataSource = dimensionDataSourceFactory(cats[2].id);
        });

    if (editMode == 'update')
        journalLineApi.getById(id)
            .then((result) => {
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

    let resetForm = (form) => {

        $scope.journalLine = {
            generalLedgerAccountId: null,
            subsidiaryLedgerAccount: null,
            detailAccountId: null,
            description: '',
            amount: null,
            balanceType: ''
        };

        $timeout(() => formService.setClean(form), 100);

        $scope.generalLedgerAccountShouldBeFocus = true;
    };

    $scope.isSaving = false;

    let save = (form) => {
        let deferred = $q.defer();

        function execute() {
            if (form.$invalid) {
                formService.setDirty(form);
                deferred.reject();
                return;
            }

            $scope.isSaving = true;

            if (editMode == 'create')
                journalLineApi.create(journalId, $scope.journalLine)
                    .then((result) => {
                        deferred.resolve(result);
                        logger.success();
                    })
                    .catch((errors) => {
                        $scope.errors = errors;
                        deferred.reject();
                    })
                    .finally(() => {
                        $scope.isSaving = false;
                        deferred.resolve();
                    });

            if (editMode == 'update')
                journalLineApi.update(id, $scope.journalLine)
                    .then(() => {
                        deferred.resolve();
                        logger.success();
                    })
                    .catch((errors) => {
                        $scope.errors = errors;
                        deferred.reject();
                    })
                    .finally(() => $scope.isSaving = false);
        }

        $timeout(execute, 0);

        return deferred.promise;
    };

    $scope.saveAndNew = (form) => {
        save(form)
            .then(() => resetForm(form));
    };

    $scope.saveAndReturn = (form) => {
        save(form)
            .then((result) => $modalInstance.close(result));
    };

    $scope.generalLedgerAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.generalLedgerAccount.all()
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.generalLedgerAccountOnChange = (current) => {
        $scope.journalLine.subsidiaryLedgerAccountId = null;

        $scope.journalLine.detailAccount = {
            canShow: false,
            isRequired: false
        };
        $scope.journalLine.dimension1 = {
            canShow: false,
            isRequired: false
        };
        $scope.journalLine.dimension2 = {
            canShow: false,
            isRequired: false
        };
        $scope.journalLine.dimension3 = {
            canShow: false,
            isRequired: false
        };
        $scope.journalLine.detailAccount = {
            canShow: false,
            isRequired: false
        };
    };

    $scope.subsidiaryLedgerAccountDataSource = {
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: (filter) => {
                    let generalLegerAccountId = new Collection(filter.filter.filters)
                        .asEnumerable()
                        .first(f => f.field == 'generalLedgerAccountId')
                        .value;

                    return devConstants.urls
                        .subsidiaryLedgerAccount
                        .allByGeneralLedgerAccount(generalLegerAccountId)
                }
            }
        },
        schema: {
            data: 'data'
        }
    };

    $scope.subsidiaryLedgerAccountSelect = (current) => {
        let item = current;

        if (!item) {
            $scope.journalLine.detailAccount = {
                canShow: false,
                isRequired: false
            };
            $scope.journalLine.dimension1 = {
                canShow: false,
                isRequired: false
            };
            $scope.journalLine.dimension2 = {
                canShow: false,
                isRequired: false
            };
            $scope.journalLine.dimension3 = {
                canShow: false,
                isRequired: false
            };

            return;
        }

        $scope.journalLine.detailAccount = {
            canShow: new Collection(['Required', 'NotRequired']).asEnumerable().contains(item.detailAccountAssignmentStatus),
            isRequired: item.detailAccountAssignmentStatus == 'Required'
        };

        $scope.journalLine.dimension1 = {
            canShow: new Collection(['Required', 'NotRequired']).asEnumerable().contains(item.dimension1AssignmentStatus),
            isRequired: item.dimension1AssignmentStatus == 'Required'
        };

        $scope.journalLine.dimension2 = {
            canShow: new Collection(['Required', 'NotRequired']).asEnumerable().contains(item.dimension2AssignmentStatus),
            isRequired: item.dimension2AssignmentStatus == 'Required'
        };

        $scope.journalLine.dimension3 = {
            canShow: new Collection(['Required', 'NotRequired']).asEnumerable().contains(item.dimension3AssignmentStatus),
            isRequired: item.dimension3AssignmentStatus == 'Required'
        };
    };

    $scope.subsidiaryLedgerAccountDataBound = (e) => e.sender.trigger('change');

    $scope.detailAccountDataSource = {
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

    let dimensionDataSourceFactory = (categoryId) => {
        return {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: devConstants.urls.dimension.allByCategory(categoryId)
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

    $scope.changeAmountBalance = () =>
        $scope.journalLine.balanceType = $scope.journalLine.balanceType == 'debtor'
            ? 'creditor'
            : 'debtor';

    $scope.close = () => $modalInstance.dismiss();
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




