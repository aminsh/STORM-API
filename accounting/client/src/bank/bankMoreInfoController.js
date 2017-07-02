export default class bankMoreInfoController {
    constructor($scope, $uibModalInstance, bankApi,data) {

        this.$scope = $scope;
        this.bankApi = bankApi;
        this.$uibModalInstance = $uibModalInstance;
        this.id = data.id;

            bankApi.smallTurnOver(this.id)
                .then(result => {
                    console.log(result);
                    this.banks = result.data;
                });
    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
