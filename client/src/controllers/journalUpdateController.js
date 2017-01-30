import accModule from '../acc.module';
import Collection from 'dev.collection';

function journalUpdateController($scope, logger, confirm, translate, navigate, $routeParams, $rootScope, constants,
                                 journalApi, journalLineApi, subsidiaryLedgerAccountApi, dimensionCategoryApi,
                                 journalLineCreateControllerModalService,
                                 journalLineUpdateControllerModalService,
                                 journalBookkeepingService,
                                 journalAttachImageService,
                                 writeChequeOnJournalLineEntryService,
                                 showReport) {

    let id = $routeParams.id;

    $scope.title = translate('Edit Journal');

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
        tagIds: []
    };

    $scope.journalTypeData = constants.enums.JournalType().data;

    $scope.canShowNumberAndDate = false;

    function fetch() {
        journalApi.getById(id)
            .then((result)=> {
                $scope.journal = result;

                $scope.canShowNumberAndDate = result.journalStatus != 'Temporary';

                let status = $scope.journalStatueForTitle;

                if ($scope.journal.isInComplete) {
                    status.icon = 'exclamation-sign';
                    status.color = 'red';
                    status.title = translate('InComplete journal');
                }

                if ($scope.journal.journalStatus == 'BookKeeped') {
                    status.icon = 'ok-circle';
                    status.color = 'green';
                    status.title = $scope.journal.journalStatusDisplay;
                }

                if ($scope.journal.journalStatus == 'Fixed') {
                    status.icon = 'lock';
                    status.color = 'blue';
                    status.title = $scope.journal.journalStatusDisplay;
                }
            });
    }

    fetch();

    $scope.gridOption = {
        columns: [
            {name: 'row', title: '#', width: '50px', type: 'number'},
            {
                name: 'detailAccountId',
                title: translate('Detail account'),
                type: 'detailAccount',
                template: '${data.detailAccountCode}',
                width: '100px'
            },
            {
                name: 'subsidiaryLedgerAccountId',
                title: translate('Subsidiary ledger account'),
                type: 'subsidiaryLedgerAccount',
                template: '${data.subsidiaryLedgerAccountCode}',
                width: '70px'
            },
            {
                name: 'generalLedgerAccountId',
                title: translate('General ledger account'),
                type: 'generalLedgerAccount',
                template: '${data.generalLedgerAccountCode}',
                width: '70px'
            },
            {
                name: 'article', title: translate('Article'), type: 'string', width: '20%',
                template: '<span title="${data.article}">${data.article}</span>'
            },
            {
                name: 'debtor', title: translate('Debtor'), width: '120px', type: 'number', format: '{0:#,##}',
                aggregates: ['sum'], footerTemplate: "#= kendo.toString(sum,'n0') #"
            },
            {
                name: 'creditor', title: translate('Creditor'), width: '120px', type: 'number', format: '{0:#,##}',
                aggregates: ['sum'], footerTemplate: "#= kendo.toString(sum,'n0') #"
            }
        ],
        commands: [
            {
                title: translate('Edit'),
                action: function (current) {
                    journalLineUpdateControllerModalService
                        .show({
                            journalId: id,
                            id: current.id
                        })
                        .then(()=> $scope.gridOption.refresh());
                }
            },
            {
                title: translate('Remove'),
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
                                .catch((errors)=>
                                    logger.error(errors.join('<b/>')));
                        })

                }
            }
        ],
        current: null,
        selectable: true,
        filterable: false,
        readUrl: journalLineApi.url.getAll(id),
        gridSize: '400px'
    };

    $scope.isSaving = false;

    $scope.save = (form)=> {
        if (form.$invalid)
            return;

        Collection.removeAll($scope.error);

        $scope.isSaving = true;

        journalApi.update(id, $scope.journal)
            .then(()=> {
                logger.success();
            })
            .catch((errors)=>$scope.errors = errors)
            .finally(()=> $scope.isSaving = false);
    };

    $scope.createJournalLine = ()=> {
        journalLineCreateControllerModalService
            .show({journalId: id})
            .then(()=> $scope.gridOption.refresh())
    };

    $scope.bookkeeping = ()=> {
        journalBookkeepingService.show({id: id})
            .then(()=> {
                logger.success();
                fetch();
            });
    };

    $scope.attachImage = ()=> {
        journalAttachImageService.show({id: id})
            .then(()=> {
                logger.success();
                fetch();
            });
    };

    $scope.print = ()=> navigate('journalPrint', {id: id});//showReport(`/report/journal/${id}`);

    $scope.writeCheque = ()=> {
        $rootScope.blockUi.block();

        let current = $scope.gridOption.current;
        subsidiaryLedgerAccountApi.getById(current.subsidiaryLedgerAccountId)
            .then((result)=> {
                $rootScope.blockUi.unBlock();

                if (result.isBankAccount) {
                    writeChequeOnJournalLineEntryService.show({
                        journalLineId: current.id,
                        detailAccountId: current.detailAccountId,
                        detailAccountDisplay: current.detailAccountDisplay,
                        amount: current.creditor,
                        description: current.article,
                        date: $scope.journal.date
                    }).then(()=> {
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
    $scope.journalLineCurrentChanged = (current)=> {
        $scope.journalLineCurrent = current;
    };

    $scope.dimensionCategories = {};

    dimensionCategoryApi.getAllLookup()
        .then((result)=> {
            let cats = result.data;
            $scope.dimensionCategories = cats;
        });

    $scope.tagsOptions = {
        placeholder: translate('Select ...'),
        dataTextField: "title",
        dataValueField: "id",
        valuePrimitive: true,
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: constants.urls.tag.getAll()
                }
            },
            schema: {
                data: 'data'
            }
        }
    };

}

accModule.controller('journalUpdateController', journalUpdateController);
