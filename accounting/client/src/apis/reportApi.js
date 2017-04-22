
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
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-ledger-accounts`)
        /*let deferred = this.$q.defer();

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
        return deferred.promise;*/
    }

    detailAccounts() {
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

    totalGeneralSubsidiaryTurnover() {
        return this.apiPromise.get(`${this.urlPrefix}/total-general-subsidiary-turnover`);
    }

    totalSubsidiaryDetailTurnover() {
        return this.apiPromise.get(`${this.urlPrefix}/total-subsidiary-detail-turnover`);
    }

    totalGeneralSubsidiaryDetailTurnover() {
        return this.apiPromise.get(`${this.urlPrefix}/total-general-subsidiary-detail-turnover`);
    }

    detailGeneralSubsidiaryTurnover() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-turnover`);
    }

    detailSubsidiaryDetailTurnover() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-subsidiary-detail-turnover`);
    }

    detailGeneralSubsidiaryDetailTurnover() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-detail-turnover`);
    }

    detailJournals() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-journal`);
    }

    detailGeneralJournal() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-journal`);
    }

    detailGeneralSubsidiaryJournal() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-journal`);
    }

    detailSubsidiaryDetailJournal() {
        return this.apiPromise.get(`${this.urlPrefix}/detail-subsidiary-detail-journal`);
    }
}
