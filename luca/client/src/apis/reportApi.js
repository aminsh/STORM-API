
export default class {
    constructor(apiPromise) {
        this.urlPrefix = '/luca/api/reports';
        this.apiPromise = apiPromise;
    }

    save(data) {
        return this.apiPromise.post(this.urlPrefix, data)
    }

    // generalLedgerAccounts(data) {
    //     return this.apiPromise.get('/luca/api/general-ledger-accounts', data);
    // }

    generalLedgerAccounts() {
        return this.apiPromise.get(`${this.urlPrefix}/general-ledger-accounts`);
    }

    subsidiaryLedgerAccounts() {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-ledger-accounts`);
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

}
