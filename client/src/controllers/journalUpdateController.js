import accModule from '../acc.module';
import Collection from 'dev.collection';

function journalUpdateController($scope, logger, confirm, translate, navigate, $routeParams, $rootScope, devConstants,
                                 journalApi, journalLineApi, subsidiaryLedgerAccountApi, dimensionCategoryApi,
                                 journalLineCreateControllerModalService,
                                 journalLineUpdateControllerModalService,
                                 journalBookkeepingService,
                                 journalAttachImageService,
                                 writeChequeOnJournalLineEntryService,
                                 tagApi,
                                 formService) {

    let id = $routeParams.id;

    $scope.errors = [];

    $scope.journalStatueForTitle = {
        icon: '',
        color: '',
        title: '',
    };

    $scope.journal = {
        temporaryNumber: null,
        temporaryDate: null,
        number: null,
        date: null,
        description: '',
        tagIds: [],
        journalType: null
    };

    $scope.journalTypeData = devConstants.enums.JournalType().data;

    $scope.canShowNumberAndDate = false;

    function fetch() {
        journalApi.getById(id)
            .then(result => {
                $scope.journal = result;

                $scope.canShowNumberAndDate = result.journalStatus != 'Temporary';

                let status = $scope.journalStatueForTitle;

                if ($scope.journal.isInComplete) {
                    status.icon = 'warning';
                    status.color = 'red';
                    status.title = translate('InComplete journal');
                }
                else {
                    if ($scope.journal.journalStatus == 'Fixed') {
                        status.icon = 'lock';
                        status.color = 'blue';
                        status.title = $scope.journal.journalStatusDisplay;
                    } else {
                        status.icon = 'check';
                        status.color = 'green';
                        status.title = $scope.journal.journalStatusDisplay;
                    }
                }
            });
    }

    fetch();

    $scope.gridOption = {
        columns: [
            {
                name: 'row', title: '#', width: '70px', type: 'number',
                filterable: false
            },
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '{{item.detailAccountCode}}',
                width: '100px'
            },
            {
                name: 'subsidiaryLedgerAccountId',
                title: translate('Subsidiary ledger account'),
                type: 'subsidiaryLedgerAccount',
                template: '{{item.subsidiaryLedgerAccountCode}}',
                width: '100px'
            },
            {
                name: 'generalLedgerAccountId',
                title: translate('General ledger account'),
                type: 'generalLedgerAccount',
                template: '{{item.generalLedgerAccountCode}}',
                width: '100px'
            },
            {
                name: 'article', title: translate('Article'), type: 'string',
                width: '30%',
                template: '<span title="{{item.article}}">{{item.article}}</span>'
            },
            {
                name: 'debtor', title: translate('Debtor'), width: '120px', type: 'number',
                template: '{{item.debtor | number}}',
                aggregates: ['sum'],
                footerTemplate: "{{aggregates.debtor.sum | number}}"
            },
            {
                name: 'creditor', title: translate('Creditor'), width: '120px', type: 'number',
                template: '{{item.creditor | number}}',
                aggregates: ['sum'],
                footerTemplate: "{{aggregates.creditor.sum | number}}"
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                icon: 'fa fa-edit',
                action: function (current) {
                    journalLineUpdateControllerModalService
                        .show({
                            journalId: id,
                            id: current.id
                        })
                        .then(() => $scope.gridOption.refresh());
                }
            },
            {
                title: translate('Remove'),
                icon: 'fa fa-trash',
                action: function (current) {
                    confirm(
                        translate('Remove General ledger account'),
                        translate('Are you sure ?'))
                        .then(function () {
                            journalLineApi.remove(current.id)
                                .then(function () {
                                    logger.success();
                                    $scope.gridOption.refresh();
                                })
                                .catch((errors) =>
                                    logger.error(errors.join('<b/>')));
                        })

                }
            }
        ],
        selectable: true,
        filterable: false,
        readUrl: journalLineApi.url.getAll(id),
        gridSize: '300px'
    };

    $scope.isSaving = false;

    $scope.save = (form) => {
        if (form.$invalid)
            return formService.setDirty(form);

        Collection.removeAll($scope.errors);

        $scope.isSaving = true;

        journalApi.update(id, $scope.journal)
            .then(() => {
                logger.success();
            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.createJournalLine = () => {
        journalLineCreateControllerModalService
            .show({journalId: id})
            .then(isInComplete => {
                $scope.gridOption.refresh();
                $scope.journal.isInComplete = isInComplete;
            });
    };

    $scope.bookkeeping = () => {
        journalBookkeepingService.show({id: id})
            .then(() => {
                logger.success();
                fetch();
            });
    };

    $scope.attachImage = () => {
        journalAttachImageService.show({id: id})
            .then(fileName => {
                $scope.journal.attachmentFileName = fileName;
                logger.success();
            });
    };

    $scope.print = () => navigate('journalPrint', {id: id});//showReport(`/report/journal/${id}`);

    $scope.writeCheque = () => {
        $rootScope.blockUi.block();

        let current = $scope.journalLineCurrent;
        subsidiaryLedgerAccountApi.getById(current.subsidiaryLedgerAccountId)
            .then((result) => {
                $rootScope.blockUi.unBlock();

                if (result.isBankAccount) {
                    writeChequeOnJournalLineEntryService.show({
                        journalLineId: current.id,
                        detailAccountId: current.detailAccountId,
                        detailAccountDisplay: current.detailAccountDisplay,
                        amount: current.creditor,
                        description: current.article,
                        date: $scope.journal.date
                    }).then(() => {
                        $scope.gridOption.refresh();
                        logger.success();
                    });
                }
                else {
                    logger.error(translate('The current subsidiaryLedgerAccount is not bank account'));
                }
            });


    };
    $scope.journalLineCurrent = false;
    $scope.journalLineCurrentChanged = (current) => {
        $scope.journalLineCurrent = current;
    };

    $scope.dimensionCategories = {};

    dimensionCategoryApi.getAllLookup()
        .then((result) => {
            let cats = result.data;
            $scope.dimensionCategories = cats;
        });

    $scope.tagsDataSource = new kendo.data.DataSource({
        batch: true,
        type: "json",
        serverFiltering: true,
        transport: {
            read: {
                url: devConstants.urls.tag.getAll()
            }
        },
        schema: {
            data: 'data'
        }
    });

    $scope.onSaveTag = value => {
      return tagApi.create({title: value});
    };
}

accModule.controller('journalUpdateController', journalUpdateController);
