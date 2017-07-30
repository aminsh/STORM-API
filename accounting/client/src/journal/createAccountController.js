"use strict";

export  default class createAccountController {
    constructor($scope, $state, generalLedgerAccountApi,$uibModalInstance,
                subsidiaryLedgerAccountApi, devConstants, logger, confirm, translate,data,formService) {

        this.generalLedgerAccountApi = generalLedgerAccountApi;
        this.subsidiaryLedgerAccountApi=subsidiaryLedgerAccountApi;
        this.$scope = $scope;
        this.$state = $state;
        this.logger = logger;
        this.confirm = confirm;
        this.translate = translate;
        this.$uibModalInstance=$uibModalInstance
        this.formService=formService;
        this.urls={getAllGeneralLedgerAccount:devConstants.urls.generalLedgerAccount.all()};
        this.data=data;
        this.errors = [];
        this.isSaving = false;
        this.subsidiaryLedgerAccount = {
            generalLedgerAccountId:null,
            code: '',
            title: this.data.title,
            isBankAccount: false,
            hasDetailAccount: false,
            hasDimension1: false,
            hasDimension2: false,
            hasDimension3: false,
        };
    }

    onGeneralLedgerAccountChanged(item, GeneralLedgerAccount) {
        item.subsidiaryLedgerAccount.generalLedgerAccountId = GeneralLedgerAccount.id;
    }
    save(form){

        let logger = this.logger,
            formService = this.formService

        if (form.$invalid) {
            return formService.setDirty(form);
        }

        this.errors.asEnumerable().removeAll();
        this.isSaving = true;

        this.subsidiaryLedgerAccountApi.create(this.subsidiaryLedgerAccount.generalLedgerAccountId, this.subsidiaryLedgerAccount)
            .then(result => {
                console.log(result);
                this.logger.success();
                //$rootScope.$emit('onSubsidiaryLedgerAccountChanged');
                this.$scope.$close(result);

            })
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    close(){
        this.$uibModalInstance.dismiss()
    }
}