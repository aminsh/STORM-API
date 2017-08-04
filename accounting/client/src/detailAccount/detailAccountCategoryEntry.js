"use strict";

export default class DetailAccountCategoryEntry {
    constructor($scope,
                $rootScope,
                detailAccountCategoryApi,
                data,
                formService,
                devConstants,
                logger,
                translate) {

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.id = data.id;
        this.logger = logger;
        this.translate = translate;
        this.formService = formService;
        this.detailAccountCategoryApi = detailAccountCategoryApi;

        this.getAllSubsidiaryLedgerAccountUrl = devConstants.urls.subsidiaryLedgerAccount.all();

        this.isSaving = false;
        this.detailAccountCategory = {
            subsidiaryLedgerAccounts: []
        };

        this.subsidiaryLedgerAccount = null;

        if (this.id)
            detailAccountCategoryApi.getById(this.id)
                .then(result => this.detailAccountCategory = result);
    }

    save(form) {
        if (form.$invalid)
            return this.formService.setDirty(form);

        if (this.detailAccountCategory.subsidiaryLedgerAccounts.length == 0)
            return this.logger.error(this.translate('You should input  one Subsidiary ledger account'));

        this.isSaving = true;

        let cmd = {
            title : this.detailAccountCategory.title,
            subsidiaryLedgerAccountIds: this.detailAccountCategory.subsidiaryLedgerAccounts
            .asEnumerable()
            .select(item => item.id)
            .toArray()
        };

        if (this.id)
            return this.detailAccountCategoryApi.update(this.id, cmd)
                .then(() => {
                    this.logger.success();
                    this.$scope.$close();
                    this.$rootScope.$emit('onDetailAccountCategoryChanged');
                })
                .catch(errors => this.errors = errors)
                .finally(() => this.isSaving = false);

        this.detailAccountCategoryApi.create(cmd)
            .then(() => {
                this.logger.success();
                this.$scope.$close();
                this.$rootScope.$emit('onDetailAccountCategoryChanged');
            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);

    }

    close() {
        this.$scope.$dismiss();
    }

    onSubsidiaryLedgerAccountChanged(item) {
        this.detailAccountCategory.subsidiaryLedgerAccounts.push(item);
        this.subsidiaryLedgerAccount = null;
    }

    removeSubsidiaryLedgerAccount(item) {
        this.detailAccountCategory.subsidiaryLedgerAccounts.asEnumerable().remove(item);
    }
}