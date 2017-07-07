export default class bankCreateController {
    constructor($scope, $uibModalInstance, formService, bankApi, logger, $state) {

        this.$scope = $scope;
        this.logger = logger;
        this.bankApi = bankApi;
        this.$uibModalInstance = $uibModalInstance;
        this.logger = logger;
        this.$state = $state;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.bank = {
            id: null,
            title: '',
            code: null,
            bankBranch: null,
            bankAccountNumber: null

        };
        this.editMode = false;

        this.id = $state.params.id;

        if (this.id != undefined)
            this.editMode = true;

        if (this.editMode) {
            bankApi.getById(this.id)
                .then(result => this.bank = result);
        }
    }


    save(form) {
        let logger = this.logger,
            formService = this.formService,
            bank = this.bank;

        if (form.$invalid) {
            return formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();
        this.isSaving = true;

        if (this.editMode) {
            return this.bankApi.update(this.id, bank)
                .then(result => {
                    logger.success();
                    this.$scope.$close(result);
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        } else {
            return this.bankApi.create(bank)
                .then(result => {
                    logger.success();
                    bank.id = result.id;
                    this.close();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }


    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
