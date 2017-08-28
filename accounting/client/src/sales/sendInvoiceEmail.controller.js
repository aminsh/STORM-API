export default class SendInvoiceEmailController{

    constructor($scope, $stateParams, data, saleApi, formService, logger){

        this.$stateParams = $stateParams;
        this.logger = logger;
        this.formService = formService;
        this.saleApi = saleApi;
        this.isSending = false;
        this.$scope = $scope;
        this.errors = [];
        this.sendEmailModel = {
            email: data.email,
            invoiceId: data.invoiceId
        };

        $scope.isSending = false;

    }

    send(form){

        if (form.$invalid)
            return this.formService.setDirty(form);

        this.$scope.isSending = true;
        this.saleApi.sendInvoiceEmail(
            this.sendEmailModel.invoiceId,
            this.sendEmailModel.email
        )
            .then((data) => {

                this.logger.success();

            })
            .finally(() => {
                this.$scope.isSending = false;
                this.close();
            });

    }

    close(){
        this.$scope.$dismiss()
    }

}