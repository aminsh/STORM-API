import Guid from "guid";

export default class {
    constructor($scope,
                $state,
                $q,
                prompt,
                confirm,
                logger,
                translate,
                navigate,
                $stateParams,
                devConstants,
                $timeout,
                journalApi,
                journalLineApi,
                promise,
                subsidiaryLedgerAccountApi,
                dimensionCategoryApi,
                dimensionApi,
                detailAccountApi,
                tagApi,
                journalAttachImageService,
                createAccountService,
                journalLineAdditionalInformation,
                formService) {

        $scope.$emit('close-sidebar');

        this.$scope = $scope;
        this.$state = $state;
        this.$q = $q;
        this.$timeout = $timeout;
        this.prompt = prompt;
        this.promise = promise;
        this.confirm = confirm;
        this.logger = logger;
        this.translate = translate;
        this.navigate = navigate;
        this.formService = formService;
        this.journalApi = journalApi;
        this.createAccountService=createAccountService;
        this.journalLineApi = journalLineApi;
        this.subsidiaryLedgerAccountApi = subsidiaryLedgerAccountApi;
        this.dimensionCategoryApi = dimensionCategoryApi;
        this.dimensionApi = dimensionApi;
        this.detailAccountApi = detailAccountApi;
        this.journalAttachImageService = journalAttachImageService;
        this.journalLineAdditionalInformation = journalLineAdditionalInformation;
        this.tagApi = tagApi;

        this.urls = {
            getAllAccounts: devConstants.urls.subsidiaryLedgerAccount.all(),
            getAllDetailAccounts: devConstants.urls.detailAccount.all(),
            getAllTags: devConstants.urls.tag.getAll()
        };
        this.id = $stateParams.id;
        this.isNewJournal = $stateParams.id == null;
        this.errors = [];
        this.tags = [];
        this.journalLines = [];
        this.journal = {
            temporaryNumber: null,
            temporaryDate: null,
            number: null,
            date: null,
            description: '',
            tagId: null,
            journalType: null
        };
        this.journalTypeData = devConstants.enums.JournalType().data;
        this.isJournalLineLoading = false;
        this.isSaving = false;

        this.subsidiaryLedgerAccount = {
            data: [],
            onChanged(item, journalLine, form) {
                form.subsidiaryLedgerAccountId.$setViewValue(item.id);
                journalLine.subsidiaryLedgerAccountId = item.id;
                journalLine.hasDetailAccount = item && item.hasDetailAccount;
                journalLine.hasDimension1 = item && item.hasDimension1;
                journalLine.hasDimension2 = item && item.hasDimension2;
                journalLine.hasDimension3 = item && item.hasDimension3;
                journalLine.isBankAccount = item && item.isBankAccount;

                $timeout(() => {
                    if (journalLine.hasDetailAccount)
                        $scope.$broadcast(`detailAccount-focus-${journalLine.id}`);
                });
            }
        };

        this.detailAccount = {
            data: [],
            onChanged(item, journalLine){
                journalLine.detailAccountId = item.id;

                $timeout(() => {
                    $scope.$broadcast(`article-focus-${journalLine.id}`);
                });
            }
        };

        this.tags = [];

        this.fetch();
    }

    fetch() {
        let $scope = this.$scope,
            $timeout = this.$timeout,
            isNewJournal = this.isNewJournal;

        $scope.$broadcast('grid-changed');

        if (isNewJournal) {
            this.journal.temporaryDate = localStorage.getItem('today');
            this.journalApi.getMaxNumber()
                .then(result => this.journal.temporaryNumber = ++result);

            /* added 2 row by default */

            $timeout(() => [1, 2].forEach(this.createJournalLine));
        }

        if (!isNewJournal) {
            this.isJournalLineLoading = true;

            this.journalApi.getById(this.id)
                .then(result => {
                    this.journal = result;
                    this.journalLines = result.journalLines;

                    this.$scope.$broadcast('grid-changed');
                })
                .finally(() => this.isJournalLineLoading = false);
        }
    }

    createNewAccount(item,title) {
        return this.promise.create((resolve, reject) => {
            this.createAccountService.show({title})
                .then(result => {
                    item.subsidiaryLedgerAccountId = result.id;
                    resolve({id: result.id, title})
                });
        });
    }

    keyUpGridRow(e, item, field) {
        if (e.keyCode == 115)
            return ['debtor', 'creditor'].includes(field) &&
                this.exchangeDebtorAndCreditor(e, item);
        if (e.keyCode == 113)
            return this.copyFromUpperItem(e, item, field);
    }

    removeJournalLine(item) {
        this.journalLines.asEnumerable().remove(item);
    }

    save(form) {
        let logger = this.logger,
            formService = this.formService,
            journal = this.journal,
            journalLines = this.journalLines;

        if (form.$invalid) {
            formService.setDirty(form);
            Object.keys(form).asEnumerable()
                .where(key => key.includes('form-'))
                .toArray()
                .forEach(key => formService.setDirty(form[key]));
            return;
        }

        let lines = this.journalLines,
            totalRemainder = lines.asEnumerable()
                .sum(line => line.debtor - line.creditor);

        if (totalRemainder != 0)
            return logger.error(this.translate('Total of debtor and creditor is not equal'));

        this.errors.asEnumerable().removeAll();

        this.isSaving = true;

        let cmd = Object.assign(journal, {journalLines});

        if (this.isNewJournal)
            return this.journalApi.create(cmd)
                .then(result => {
                    logger.success();
                    journal.id = result.id;
                })
                .catch(err => {
                    this.errors = err;
                })
                .finally(() => this.isSaving = false);

        this.journalApi.update(this.id, this.journal)
            .then(() => logger.success())
            .catch(err => {
                console.log(err);
                this.errors = err;
            })
            .finally(() => this.isSaving = false);
    }

    createJournalLine() {
        let $scope = this.$scope;

        let maxRow = this.journalLines.length == 0
                ? 0
                : this.journalLines.asEnumerable().max(line => line.row),
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

        this.journalLines.push(newJournal);

        this.$timeout(() => {
            $scope.$broadcast('grid-scroll-to-row', {id: newJournal.id});
            $scope.$broadcast(`subsidiaryLedgerAccount-focus-${newJournal.id}`);
            $scope.$broadcast('grid-changed');
        });
    }

    attachImage() {
        this.journalAttachImageService.show({id: this.journal.id})
            .then(fileName => {
                this.journal.attachmentFileName = fileName;
                this.logger.success();
            });
    }

    print() {
        //report/100?minNumber=5&maxNumber=5

        let reportParam = {"minNumber": this.journal.temporaryNumber, "maxNumber": this.journal.temporaryNumber}
        this.navigate(
            'report.print',
            {key: 100},
            reportParam);
        //  this.navigate('journalPrint', {id: id});
    }

    onTagCreated(value) {
        this.prompt({
            title: this.translate('Create Tag'),
            text: this.translate('Enter Tag Title'),
            defaultValue: value
        }).then(inputValue => {
            this.tagApi.create({title: inputValue})
                .then(result => this.journal.tagId = result.id);
        });
    }

    additionalInfo(journalLine) {
        this.journalLineAdditionalInformation.show({
            journal: this.journal,
            journalLine
        }).then(journalLine => {
            this.journalLine = journalLine;
        });
    }

    //privates

    exchangeDebtorAndCreditor(e, item) {
        e.preventDefault();

        let debtor = item.debtor,
            creditor = item.creditor;

        item.debtor = creditor;
        item.creditor = debtor;
    }

    copyFromUpperItem(e, item, field) {
        e.preventDefault();

        let currentIndex = this.journalLines.indexOf(item);

        if (currentIndex == 0)
            return;

        let upperItem = this.journalLines[currentIndex - 1];

        item[field] = upperItem[field];

        if (['subsidiaryLedgerAccountId', 'detailAccountId'].includes(field)) {
            let columnName = field.replace('Id', ''),
                id = item[field],
                model = this[columnName].data.asEnumerable()
                    .single(p => p.id == id);

            this[columnName].onChanged(model, item);
        }
    }

    confirmJournal() {
        if (this.isNewJournal)
            return;

        this.confirm(
            this.translate('Are you sure ?'),
            this.translate('Confirm journal'))
            .then(() => {
                this.journalApi.confirm(this.journal.id)
                    .then(() => {
                        this.logger.success();
                        this.$state.go('^.list');
                    });
            });
    }
}


