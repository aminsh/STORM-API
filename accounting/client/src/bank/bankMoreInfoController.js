export default class bankMoreInfoController {
    constructor($scope, $uibModalInstance, bankApi, data, fundApi) {

        this.$scope = $scope;
        this.bankApi = bankApi;
        this.fundApi = fundApi;
        this.$uibModalInstance = $uibModalInstance;
        this.id = data.id;
        this.type = data.type;
        this.title = data.title;

        this.fetch();
    }

    fetch() {
        this[`${this.type}Api`].smallTurnOver(this.id)
            .then(result => this.items = result.data);
    }

    close() {
        this.$uibModalInstance.dismiss()
    }
}
