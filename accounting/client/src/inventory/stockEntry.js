export default class StockController {
    constructor($scope, $rootScope ,formService, stockApi, logger,data, confirmWindowClosing) {

        this.confirmWindowClosing = confirmWindowClosing;
        this.confirmWindowClosing.activate();

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.logger = logger;
        this.stockApi = stockApi;
        this.logger = logger;
        this.formService = formService;
        this.errors = [];
        this.isSaving = false;

        this.stock = {
            title: '',
            address: ''
        };

        this.id = data.id;

       if(this.id)
           stockApi.getById(this.id)
               .then(result => this.stock = result);
    }


    save(form) {
        let logger = this.logger,
            formService = this.formService;

        if (form.$invalid)
            return formService.setDirty(form);

        this.errors = [];
        this.isSaving = true;

        if (this.id) {
            return this.stockApi.update(this.id, this.stock)
                .then(() => {
                    logger.success();

                    this.$rootScope.$emit('onStockChanged');
                    this.$scope.$close();
                    this.confirmWindowClosing.deactivate();

                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        } else {
            return this.stockApi.create(this.stock)
                .then(() => {
                    logger.success();

                    this.$rootScope.$emit('onStockChanged');
                    this.$scope.$close();
                    this.confirmWindowClosing.deactivate();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }


    }

    close() {
        this.$scope.$dismiss();
        this.confirmWindowClosing.deactivate();
    }
}
