
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

    generalLedgerAccounts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-ledger-accounts`,params);
    }

    subsidiaryLedgerAccounts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-ledger-accounts`,params);
    }

    detailAccounts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-accounts`,params);
    }

    generalBalance(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-balance`,params);
    }

    subsidiaryBalance(params) {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-balance`,params);
    }

    subsidiaryDetailBalance(params) {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-detail-balance`,params);
    }

    generalSubsidiaryDetailBalance(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-subsidiary-detail-balance`,params);
    }

    journalOffice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/journal-office`,params);
    }

    generalOffice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-office`,params);
    }

    subsidiaryOffice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-office`,params);
    }

    totalGeneralSubsidiaryTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/total-general-subsidiary-turnover`,params);
    }

    totalSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/total-subsidiary-detail-turnover`,params);
    }

    totalGeneralSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/total-general-subsidiary-detail-turnover`,params);
    }

    detailGeneralSubsidiaryTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-turnover`,params);
    }

    detailSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-subsidiary-detail-turnover`,params);
    }

    detailGeneralSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-detail-turnover`,params);
    }

    detailJournals(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-journal`,params);
    }

    detailGeneralJournal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-journal`,params);
    }

    detailGeneralSubsidiaryJournal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-journal`,params);
    }

    detailSubsidiaryDetailJournal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-subsidiary-detail-journal`,params);
    }
}
