export default class peopleCreateController {
    constructor($scope, $rootScope, $uibModalInstance, formService, fundApi, logger, $state, confirmWindowClosing) {

        this.confirmWindowClosing = confirmWindowClosing;
        this.confirmWindowClosing.activate();

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.logger = logger;
        this.fundApi = fundApi;
        this.$uibModalInstance = $uibModalInstance;
        this.logger = logger;
        this.$state = $state;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;
        this.fund = {
            title: ''
        };
        this.editMode = false;

        this.id = $state.params.id;

        if (this.id != undefined)
            this.editMode = true;

        if (this.editMode) {
            fundApi.getById(this.id)
                .then(result => this.fund = result);
        }
    }


    save(form) {
        let logger = this.logger,
            formService = this.formService,
            fund = this.fund;

        if (form.$invalid) {
            return formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();
        this.isSaving = true;

        if (this.editMode) {
            return this.fundApi.update(this.id, fund)
                .then(() => {
                    logger.success();

                    this.$rootScope.$emit('onFundChanged');
                    this.$scope.$close();
                    this.confirmWindowClosing.deactivate();

                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        } else {
            return this.fundApi.create(fund)
                .then(result => {
                    logger.success();

                    this.$rootScope.$emit('onFundChanged');
                    this.$scope.$close();
                    this.confirmWindowClosing.deactivate();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }


    }

    close() {
        this.$uibModalInstance.dismiss();
        this.confirmWindowClosing.deactivate();
    }
}
