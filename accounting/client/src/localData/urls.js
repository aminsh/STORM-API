let rootUrl = ()=> '/api/v1';

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

let dimensionCategory = {
    all: ()=> `${rootUrl()}/dimension-categories`
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

let cheque = {
    all: (categoryId)=> '{0}/cheques/category/{1}'.format(rootUrl(), categoryId),
    allwhites: (categoryId)=> '{0}/cheques/category/{1}/whites'.format(rootUrl(), categoryId),
    allUseds: ()=> '{0}/cheques/useds'.format(rootUrl())
};

let journal = {
    getGroupedByMouth: ()=> '{0}/journals/summary/grouped-by-month'.format(rootUrl()),
    getByMonth: (month)=> '{0}/journals/month/{1}'.format(rootUrl(), month),
    getAllByPeriod: (periodId)=> '{0}/journals/period/{1}'.format(rootUrl(), periodId),
    getPayablesNotHaveChequeLines: detailAccountId=> `${rootUrl()}/journals/${detailAccountId}/payable-transactions/not-have-cheque`
};

let journalTemplate = {
    getAll: ()=> '{0}/journal-templates'.format(rootUrl())
};

let accountReview = {
    getAllGeneralLedgerAccount: ()=> `${rootUrl()}/account-review/general-ledger-account`,
    getAllSubsidiaryLedgerAccount: ()=> `${rootUrl()}/account-review/subsidiary-ledger-account`,
    getAllDetailAccount: ()=> `${rootUrl()}/account-review/detail-account`,
    getAllDimension1: ()=> `${rootUrl()}/account-review/dimension-1`,
    getAllDimension2: ()=> `${rootUrl()}/account-review/dimension-2`,
    getAllDimension3: ()=> `${rootUrl()}/account-review/dimension-3`,
    getAllTiny: ()=> `${rootUrl()}/account-review/tiny`
};

let tag = {
    getAll: ()=> `${rootUrl()}/tags`
};

let people = {
    getAll: ()=> `${rootUrl()}/people`
};

let fund = {
    getAll: ()=> `${rootUrl()}/funds`
};

let bank = {
    getAll: ()=> `${rootUrl()}/banks`
};


let sales = {
    getAll: ()=> `${rootUrl()}/sales`
};

let purchase = {
    getAll: ()=> `${rootUrl()}/purchases`
};

let products = {
    getAll: ()=> `${rootUrl()}/products`
};

let apiUrls = {
    rootUrl: rootUrl(),
    generalLedgerAccount: generalLedgerAccount,
    subsidiaryLedgerAccount: subsidiaryLedgerAccount,
    detailAccount: detailAccount,
    dimensionCategory: dimensionCategory,
    dimension: dimension,
    period: period,
    chequeCategory: chequeCategory,
    bank: bank,
    cheque: cheque,
    journal: journal,
    journalTemplate: journalTemplate,
    accountReview: accountReview,
    tag: tag,
    sales:sales,
    purchase:purchase,
    products:products,
    people:people,
    fund:fund
};

export default apiUrls;