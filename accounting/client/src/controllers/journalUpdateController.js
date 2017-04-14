import accModule from '../acc.module';
import Guid from 'guid';

function journalUpdateController($scope, logger, confirm, translate, navigate, $stateParams, $rootScope, devConstants, $timeout,
                                 journalApi, journalLineApi, subsidiaryLedgerAccountApi, dimensionCategoryApi, dimensionApi, detailAccountApi,
                                 journalLineUpdateControllerModalService,
                                 journalBookkeepingService,
                                 journalAttachImageService,
                                 writeChequeOnJournalLineEntryService,
                                 tagApi,
                                 formService) {

    let id = $stateParams.id,
        columnConfig = {
            subsidiaryLedgerAccount: {
                dataSource: [],
                onChanged(item, journalLine){
                    journalLine.canShowDetailAccount = item && item.hasDetailAccount;
                    journalLine.canShowDimension1 = item && item.hasDimension1;
                    journalLine.canShowDimension2 = item && item.hasDimension2;
                    journalLine.canShowDimension3 = item && item.hasDimension3;
                }
            },
            detailAccount: {
                dataSource: []
            },
            dimension1: {
                dataSource: []
            },
            dimension2: {
                dataSource: []
            },
            dimension3: {
                dataSource: []
            }
        };


    $scope.errors = [];
    $scope.journalLines = [];
    $scope.aggregates = {creditor: {sum: 0}, debtor: {sum: 0}};

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
                dataSource: columnConfig.detailAccount.dataSource,
                canShow: false,
                template: `<dev-tag-combo-box
                            ng-if="item.canShowDetailAccount"
                            name="detailAccountId"
                            k-placeholder="{{'Select ...'|translate}}"
                            k-data-value-field="id"
                            k-data-text-field="display"
                            k-data-source="column.dataSource"
                            ng-model="item.detailAccountId"
                            required
                            style="width: 100%"></dev-tag-combo-box>`,
                width: '25%'
            },
            {
                name: 'subsidiaryLedgerAccountId',
                title: translate('Account'),
                type: 'subsidiaryLedgerAccount',
                dataSource: columnConfig.subsidiaryLedgerAccount.dataSource,
                onChanged: columnConfig.subsidiaryLedgerAccount.onChanged,
                template: `<dev-tag-combo-box
                            name="subsidiaryLedgerAccountId"
                            k-placeholder="{{'Select ...'|translate}}"
                            k-data-value-field="id"
                            k-data-text-field="account"
                            k-data-source="column.dataSource"
                            k-on-changed="column.onChanged.bind(scope.item)"
                            k-on-data-bound="column.onChanged.bind(scope.item)"
                            ng-model="item.subsidiaryLedgerAccountId"
                            required></dev-tag-combo-box>
                    <div ng-messages="subForm.subsidiaryLedgerAccountId.$error"
                         ng-if="form['form-'+item.id].subsidiaryLedgerAccountId.$dirty">
                        <label ng-message="required"
                              class="error">{{'This field is required'|translate}}</label>
                    </div>`,
                width: '15%'
            },
            {
                name: 'article', title: translate('Article'), type: 'string',
                width: '30%',
                template: `<dev-tag-text-box ng-model="item.article" name="article" required></dev-tag-text-box>
                    <div ng-messages="subForm.article.$error" ng-if="subForm.article.$dirty">
                        <label ng-message="required"
                              class="error">{{'This field is required'|translate}}</label>
                    </div>`
            },
            {
                name: 'debtor', title: translate('Debtor'), type: 'number',
                template: `<dev-tag-numeric
                            class="form-control"
                            ng-init="isOpenNumericPopover=true"
                            ng-model="item.debtor"
                            name="debtor"
                            required
                            not-zero
                            popover-is-open="isOpenNumericPopover"
                            popover-template="'partials/templates/amount-template.html'"
                            popover-placement="left"></dev-tag-numeric>`,
                aggregates: ['sum'],
                footerTemplate: "{{data | totalSum: ('debtor') | number}}",
                width: '10%'
            },
            {
                name: 'creditor', title: translate('Creditor'), type: 'number',
                template: `<dev-tag-numeric
                            class="form-control"
                            ng-init="isOpenNumericPopover=true"
                            ng-model="item.creditor"
                            name="creditor"
                            required
                            not-zero
                            popover-is-open="isOpenNumericPopover"
                            popover-template="'partials/templates/amount-template.html'"
                            popover-placement="left"></dev-tag-numeric>`,
                aggregates: ['sum'],
                footerTemplate: "{{data | totalSum: ('creditor') | number}}",
                width: '10%'
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
        selectable: false,
        pageable: false,
        pageSize: 1000,
        filterable: false,
        readUrl: journalLineApi.url.getAll(id),
        gridSize: '300px',
        columnConfig
    };

    $scope.columnConfig = columnConfig;

    $scope.fetchJournalLines = () => {

        subsidiaryLedgerAccountApi.getAll()
            .then(result => {
                columnConfig.subsidiaryLedgerAccount.dataSource = result.data;

                journalLineApi.getAll(id)
                    .then(result => {
                        let subsidiaryLedgerAccounts = columnConfig.subsidiaryLedgerAccount.dataSource;

                        result.data.forEach(item => {
                            let subsidiaryLedgerAccount = subsidiaryLedgerAccounts
                                .asEnumerable()
                                .single(s => s.id == item.subsidiaryLedgerAccountId);

                            item.canShowDetailAccount = subsidiaryLedgerAccount.hasDetailAccount;
                            item.canShowDimension1 = subsidiaryLedgerAccount.hasDimension1;
                            item.canShowDimension2 = subsidiaryLedgerAccount.hasDimension2;
                            item.canShowDimension3 = subsidiaryLedgerAccount.hasDimension3;
                        });

                        $scope.journalLines = result.data;
                        $scope.$emit('gird-changed');
                    });
            });

        detailAccountApi.getAll()
            .then(result => columnConfig.detailAccount.dataSource = result.data);

        dimensionCategoryApi.getAllLookupSync().data.forEach((cat, i) => dimensionApi.getByCategory(cat.id)
            .then(result => columnConfig[`dimension${i + 1}`].dataSource = result.data));
    };

    $scope.fetchJournalLines();

    $scope.removeJournalLine = item => $scope.journalLines.asEnumerable().remove(item);

    $scope.isSaving = false;

    $scope.save = (form) => {
        if (form.$invalid) {
            formService.setDirty(form);
            //formService.setDirty(form.subForm);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        $scope.errors.asEnumerable().removeAll();

        $scope.isSaving = true;

        journalApi.update(id, $scope.journal)
            .then(() => {
                logger.success();
            })
            .catch((errors) => $scope.errors = errors)
            .finally(() => $scope.isSaving = false);
    };

    $scope.createJournalLine = () => {

        let maxRow = $scope.journalLines.asEnumerable().max(line => line.row) || 0,
            newJournal = {
                id: Guid.new(),
                row: ++maxRow,
                generalLedgerAccountId: null,
                subsidiaryLedgerAccountId: null,
                detailAccountId: null,
                dimension1Id: null,
                dimension2Id: null,
                dimension3Id: null,
                article: '',
                debtor: 0,
                creditor: 0
            };

        $scope.journalLines.unshift(newJournal);

        $timeout(() => $scope.$broadcast(`subsidiaryLedgerAccount-focus-${newJournal.id}`));
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

    $scope.people = [{fname: '', id: 1}, {fname: '', id: 2}, {fname: '', id: 3}];

    $scope.submit = (form) => {
        formService.setDirty(form);

        Object.keys(form).asEnumerable()
            .where(key => key.includes('subFormX-'))
            .toArray()
            .forEach(key => formService.setDirty(form[key]));
    };

    $scope.debtorOrCreditorChanged = (changedField, anotherField, item) => {
        if (item[changedField] != 0)
            item[anotherField] = 0;
    };


}

accModule.controller('journalUpdateController', journalUpdateController)
    .directive('notShouldBeZeroBoth', function ($parse) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                let anotherFieldFn = $parse(attrs.notShouldBeZeroBoth);

                ngModel.$parsers.unshift(validate);
                ngModel.$formatters.push(validate);

                function validate(value) {
                    let anotherValue = parseInt(anotherFieldFn(scope)),
                        isValid = (anotherValue + parseInt(value)) != 0;

                    ngModel.$setValidity('notShouldBeZeroBoth', isValid);

                    return value;
                }

                scope.$watch(attrs.notShouldBeZeroBoth, () => validate(ngModel.$viewValue));
            }
        };
    })
    .directive('notShouldHaveValueBoth', function ($parse) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
                let anotherFieldFn = $parse(attrs.notShouldHaveValueBoth);

                ngModel.$parsers.unshift(validate);
                ngModel.$formatters.push(validate);

                function validate(value) {
                    let anotherValue = parseInt(anotherFieldFn(scope)),
                        isValid = !(parseInt(value) > 0 && anotherValue > 0);

                    ngModel.$setValidity('notShouldHaveValueBoth', isValid);

                    return value;
                }

                scope.$watch(attrs.notShouldHaveValueBoth, () => validate(ngModel.$viewValue));
            }
        };

    })
    .filter('remainder',function () {
        return (lines) => lines.asEnumerable().sum(item => item.debtor - item.creditor);
    });
