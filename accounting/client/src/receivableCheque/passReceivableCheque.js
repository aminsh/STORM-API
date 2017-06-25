"use strict";

export default class PassReceivableChequeController {
    constructor($scope, receivableChequeApi, formService, devConstants, data) {

        this.$scope = $scope;
        this.receivableChequeApi = receivableChequeApi;
        this.formService = formService;

        this.isSaving = false;
        this.errors = [];
        this.payment = {};
        this.id = data.id;

        this.urls = {
            getAllFunds: devConstants.urls.fund.getAll(),
            getAllBanks: devConstants.urls.bank.getAll(),
        };

        this.cashTypes = devConstants.enums.DetailAccountType().data
            .asEnumerable()
            .where(e => e.key != 'person').toArray();

        this.cashType = 'fund';

        $scope.$watch(
            () => this.cashType,
            () => this.payment = getPayment(this.cashType));

        let getPayment = type => {
            if (type == 'fund')
                return {
                    date: null,
                    amount: 0,
                    fundId: null,
                    paymentType: 'cash'
                };

            if (type == 'bank')
                return {
                    date: null,
                    number: null,
                    amount: 0,
                    bankId: null,
                    paymentType: 'receipt'
                };
        };
    }

    save(from) {
        if (from.$invalid)
            return this.formService.setDirty(from);

        this.isSaving = true;
        this.errors = [];

        this.receivableChequeApi.passCheque(this.id, this.payment)
            .then(() => this.$scope.$close())
            .catch(errors => this.errors = errors)
            .finally(() => this.isSaving = false);
    }

    close() {
        this.$scope.$dismiss();
    }
}