
export default class {
    constructor(apiPromise, $q, devConstants) {
        this.urlPrefix = '/acc/api/reports';
        this.apiPromise = apiPromise;
        this.$q = $q;
        this.constants = devConstants;
    }

    save(data) {
        return this.apiPromise.post(this.urlPrefix, data)
    }

    generalLedgerAccounts() {
        return this.apiPromise.get(`${this.urlPrefix}/general-ledger-accounts`);
    }

    subsidiaryLedgerAccounts() {
        let deferred = this.$q.defer();

        this.apiPromise.get(`${this.urlPrefix}/subsidiary-ledger-accounts`)
            .then(result => {
                let AssignmentStatus = this.constants.enums.AssignmentStatus();

                result.forEach(item => {
                    item.detailAccountAssignmentStatusDisplay = (item.detailAcc) ? AssignmentStatus.getDisplay(item.detailAcc) : '';
                    item.dimension1AssignmentStatusDisplay = (item.dim1) ? AssignmentStatus.getDisplay(item.dim1) : '';
                    item.dimension2AssignmentStatusDisplay = (item.dim2) ? AssignmentStatus.getDisplay(item.dim2) : '';
                    item.dimension3AssignmentStatusDisplay = (item.dim3) ? AssignmentStatus.getDisplay(item.dim3) : '';
                });

                deferred.resolve(result);
            });
        return deferred.promise;
    }

    detailAccounts(reportId) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-accounts`);
    }

    generalBalance() {
        return this.apiPromise.get(`${this.urlPrefix}/general-balance`);
    }

    subsidiaryBalance() {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-balance`);
    }

    subsidiaryDetailBalance() {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-detail-balance`);
    }

    generalSubsidiaryDetailBalance() {
        return this.apiPromise.get(`${this.urlPrefix}/general-subsidiary-detail-balance`);
    }

    journalOffice() {
        return this.apiPromise.get(`${this.urlPrefix}/journal-office`);
    }

    generalOffice() {
        return this.apiPromise.get(`${this.urlPrefix}/general-office`);
    }

    subsidiaryOffice() {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-office`);
    }

}
