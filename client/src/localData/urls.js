let rootUrl = ()=> '/api'

let generalLedgerAccount = {
    all: ()=> '{0}/general-ledger-accounts'.format(rootUrl())
}

let subsidiaryLedgerAccount = {
    all: ()=> '{0}/subsidiary-ledger-accounts'.format(rootUrl()),
    allByGeneralLedgerAccount: (generalLedgerAccountId)=>
        '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'
            .format(rootUrl(), generalLedgerAccountId)
}

let detailAccount = {
    all: ()=> '{0}/detail-accounts'.format(rootUrl())
}

let dimension = {
    allByCategory: (categoryId)=> '{0}/dimensions/category/{1}'.format(rootUrl(), categoryId)
}

let period = {
    all: ()=> '{0}/periods'.format(rootUrl())
};

let chequeCategory = {
    all: ()=> '{0}/cheque-categories'.format(rootUrl())
};

let bank = {
    all: ()=> '{0}/banks'.format(rootUrl())
};

let cheque = {
    all: (categoryId)=> '{0}/cheques/category/{1}'.format(rootUrl(), categoryId)
};

let apiUrls = {
    generalLedgerAccount: generalLedgerAccount,
    subsidiaryLedgerAccount: subsidiaryLedgerAccount,
    detailAccount: detailAccount,
    dimension: dimension,
    period: period,
    chequeCategory: chequeCategory,
    bank: bank,
    cheque: cheque
};

export default apiUrls;