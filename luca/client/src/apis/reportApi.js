
export default class {
    constructor(apiPromise) {
        this.urlPrefix = '/luca/api/reports';
        this.apiPromise = apiPromise;
    }

    save(data) {
        return this.apiPromise.post(this.urlPrefix, data)
    }

    generalLedgerAccounts(data){
        return this.apiPromise.get('/luca/api/general-ledger-accounts', data);
    }
}
