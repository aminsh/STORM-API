import accModule from "../acc.module";

function generalLedgerAccountApi(apiPromise, devConstants) {
    var urlPrefix = devConstants.urls.rootUrl;

    return {
        url: {
            getAll: '{0}/general-ledger-accounts'.format(urlPrefix),
            getAllActive: '{0}/general-ledger-accounts/active'
                .format(urlPrefix)
        },
        getAll(){
            return apiPromise.get(`${urlPrefix}/general-ledger-accounts`);
        },
        getChartOfAccounts(){
            return apiPromise.get(`${urlPrefix}/general-ledger-accounts/chart-of-accounts`);
        },
        getById: function (id) {
            return apiPromise.get('{0}/general-ledger-accounts/{1}'
                .format(urlPrefix, id));
        },
        create: function (data) {
            return apiPromise.post('{0}/general-ledger-accounts'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/general-ledger-accounts/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/general-ledger-accounts/{1}'.format(urlPrefix, id));
        },
        activate: function (id) {
            return apiPromise.put('{0}/general-ledger-accounts/{1}/activate'.format(urlPrefix, id));
        },
        deactivate: function (id) {
            return apiPromise.put('{0}/general-ledger-accounts/{1}/deactivate'.format(urlPrefix, id));
        }
    };
}

accModule.factory('generalLedgerAccountApi', generalLedgerAccountApi);
