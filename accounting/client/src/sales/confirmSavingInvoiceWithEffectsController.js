export default class ConfirmSavingInvoiceWithEffectsController {

    constructor($scope, data) {

        this.$scope = $scope;
        this.effects = data.effects;
        this.saveAction = data.saveAction;
    }

    confirm() {
        this.$scope.$close();
        this.saveAction();
    }

    close() {
        this.$scope.$dismiss();
    }
}