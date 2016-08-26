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

let apiUrls = {
    generalLedgerAccount: generalLedgerAccount,
    subsidiaryLedgerAccount: subsidiaryLedgerAccount,
    detailAccount: detailAccount,
    dimension: dimension
};

export default apiUrls;