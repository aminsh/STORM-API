class ReportApi {
    constructor(apiPromise, $q, devConstants) {
        this.urlPrefix = `${devConstants.urls.rootUrl}/reports`;
        this.apiPromise = apiPromise;
        this.$q = $q;
        this.constants = devConstants;
    }

    save(data) {
        return this.apiPromise.post(this.urlPrefix, data)
    }

    generalLedgerAccounts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-ledger-accounts`, params);
    }

    subsidiaryLedgerAccounts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-ledger-accounts`, params);
    }

    detailAccounts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-accounts`, params);
    }

    generalBalance(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-balance`, params);
    }

    /*
     subsidiaryBalance(params) {
     return this.apiPromise.get(`${this.urlPrefix}/subsidiary-balance`, params);
     }

     subsidiaryDetailBalance(params) {
     return this.apiPromise.get(`${this.urlPrefix}/subsidiary-detail-balance`, params);
     }

     generalSubsidiaryDetailBalance(params) {
     return this.apiPromise.get(`${this.urlPrefix}/general-subsidiary-detail-balance`, params);
     }*/

    journalOffice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/journal-office`, params);
    }

    generalOffice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/general-office`, params);
    }

    subsidiaryOffice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/subsidiary-office`, params);
    }

    totalGeneralSubsidiaryTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/total-general-subsidiary-turnover`, params);
    }

    totalSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/total-subsidiary-detail-turnover`, params);
    }

    totalGeneralSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/total-general-subsidiary-detail-turnover`, params);
    }

    detailGeneralSubsidiaryTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-turnover`, params);
    }

    detailSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-subsidiary-detail-turnover`, params);
    }

    detailGeneralSubsidiaryDetailTurnover(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-detail-turnover`, params);
    }

    detailJournals(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-journal`, params);
    }

    detailGeneralJournal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-journal`, params);
    }

    detailGeneralSubsidiaryJournal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-general-subsidiary-journal`, params);
    }

    detailSubsidiaryDetailJournal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/detail-subsidiary-detail-journal`, params);
    }

    invoice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/invoices`, params);
    }

    getInventoriesOutput(params) {
        return this.apiPromise.get(`${this.urlPrefix}/inventory-outputs`, params)
    }

    getInventoriesInput(params) {
        return this.apiPromise.get(`${this.urlPrefix}/inventory-input`, params)
    }

    getInventoriesTurnover(params) {
        let ids = params.stocks.length === 0 ? params.ids : params.stocks;
        return this.apiPromise.get(`${this.urlPrefix}/inventory-turnover`, {ids})
    }

    getProductTurnover(params) {
        let ids = params.products.length === 0 ? params.ids : params.products,
            fixedType = params.fixedType ? params.fixedType : params.inventoryFixedStatuses;
        return this.apiPromise.get(`${this.urlPrefix}/product-turnover`, {ids, fixedType})
    }

    getProductTurnoverTotal(params) {
        let ids = params.products.length === 0 ? params.ids : params.products,
            fixedType = params.fixedType ? params.fixedType : params.inventoryFixedStatuses;
        return this.apiPromise.get(`${this.urlPrefix}/product-turnover-total`, {ids, fixedType})
    }

    generalLedgerAccountReview(params) {
        const reportParam = {
            extra: {filter: params},
            filter: {logic: 'and', filters: []},
        };

        return this.apiPromise.get(`${this.constants.urls.rootUrl}/account-review/general-ledger-account`, reportParam)
    }

    subsidiaryAccountReview(params) {
        const reportParam = {
            extra: {filter: params},
            filter: {logic: 'and', filters: []},
        };

        return this.apiPromise.get(`${this.constants.urls.rootUrl}/account-review/subsidiary-ledger-account`, reportParam)
    }

    detailAccountReview(params) {
        const reportParam = {
            extra: {filter: params},
            filter: {logic: 'and', filters: []},
        };

        return this.apiPromise.get(`${this.constants.urls.rootUrl}/account-review/detail-account`, reportParam)
    }

    tinyAccountReview(params) {
        const reportParam = {
            extra: {filter: params},
            filter: {logic: 'and', filters: []},
        };

        return this.apiPromise.get(`${this.constants.urls.rootUrl}/account-review/tiny`, reportParam)
    }

    getSeasonal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/seasonal`, params)
    }

    getTotalSeasonal(params) {
        return this.apiPromise.get(`${this.urlPrefix}/seasonal`, params)
    }

    getBalanceSheet(params) {
        return this.apiPromise.get(`${this.urlPrefix}/balance-sheet`, params)
    }

    getProfitLossStatement(params) {
        return this.apiPromise.get(`${this.urlPrefix}/profit-loss-statement`, params)
    }

    getCompareProfitLossStatement(params) {
        return this.apiPromise.get(`${this.urlPrefix}/compare-profit-loss-statement`, params)
    }

    getCustomerReceipts(params) {
        return this.apiPromise.get(`${this.urlPrefix}/customer-receipts`, params)
    }

    getUnofficialInvoice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/un-invoices`, params)
    }

    getPreInvoice(params) {
        return this.apiPromise.get(`${this.urlPrefix}/pre-invoices`, params)
    }
}

export default ReportApi;
