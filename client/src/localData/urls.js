let rootUrl = ()=> '/api';

let generalLedgerAccount = {
    all: ()=> '{0}/general-ledger-accounts'.format(rootUrl())
};

let subsidiaryLedgerAccount = {
    all: ()=> '{0}/subsidiary-ledger-accounts'.format(rootUrl()),
    allByGeneralLedgerAccount: (generalLedgerAccountId)=>
        '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'
            .format(rootUrl(), generalLedgerAccountId)
};

let detailAccount = {
    all: ()=> '{0}/detail-accounts'.format(rootUrl())
};

let dimension = {
    allByCategory: (categoryId)=> '{0}/dimensions/category/{1}'.format(rootUrl(), categoryId)
};

let period = {
    all: ()=> '{0}/fiscal-periods'.format(rootUrl())
};

let chequeCategory = {
    all: ()=> '{0}/cheque-categories'.format(rootUrl()),
    allOpens: (detailAccountId)=> '{0}/cheque-categories/detail-account/{1}/opens'.format(rootUrl(), detailAccountId)
};

let bank = {
    all: ()=> '{0}/banks'.format(rootUrl())
};

let cheque = {
    all: (categoryId)=> '{0}/cheques/category/{1}'.format(rootUrl(), categoryId),
    allwhites: (categoryId)=> '{0}/cheques/category/{1}/whites'.format(rootUrl(), categoryId)
};

let journal = {
    getGroupedByMouth: ()=> '{0}/journals/summary/grouped-by-month'.format(rootUrl()),
    getByMonth: (month)=> '{0}/journals/month/{1}'.format(rootUrl(), month)
}

let apiUrls = {
    generalLedgerAccount: generalLedgerAccount,
    subsidiaryLedgerAccount: subsidiaryLedgerAccount,
    detailAccount: detailAccount,
    dimension: dimension,
    period: period,
    chequeCategory: chequeCategory,
    bank: bank,
    cheque: cheque,
    journal: journal
};

export default apiUrls;