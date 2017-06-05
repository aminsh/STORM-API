

export default class peopleCreateController {
    constructor($scope, $uibModalInstance, formService, fundApi, logger,$state) {

        this.$scope = $scope;
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
        this.editMode=false;

        this.id = $state.params.id;

        if(this.id!=undefined)
            this.editMode=true;

        if(this.editMode){
            fundApi.getById(this.id)
                .then(result => this.fund= result);
        }
    }


    save(form) {
        let logger = this.logger,
            formService = this.formService,
            fund = this.fund;

        if (form.$invalid) {
            return  formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();
        this.isSaving = true;

        if(this.editMode){
            return this.fundApi.update(this.id,fund)
                .then(result => {
                    logger.success();
                    this.close();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }else{
            return this.fundApi.create(fund)
                .then(result => {
                    logger.success();
                    fund.id = result.id;
                    this.close();
                })
                .catch(err => this.errors = err)
                .finally(() => this.isSaving = false);
        }


    }
    close(){
        this.$uibModalInstance.dismiss()
    }
}
