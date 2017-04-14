import accModule from '../acc.module';

function subsidiaryLedgerAccountApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {
        url: {
            getAll: function (parentId) {
                return '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'.format(urlPrefix, parentId);
            },
            getAllActive: function (parentId) {
                return '{0}/subsidiary-ledger-accounts/general-ledger-account/{1}/active'.format(urlPrefix, parentId)
            }
        },
        getAll(){
            return apiPromise.get(`${urlPrefix}/subsidiary-ledger-accounts`);
        },
        getById: function (id) {
            return apiPromise.get('{0}/subsidiary-ledger-accounts/{1}/'
                .format(urlPrefix, id));
        },
        create: function (parentId, data) {
            return apiPromise.post('{0}/subsidiary-ledger-accounts/general-ledger-account/{1}'
                .format(urlPrefix, parentId), data);
        }
        ,
        update: function (id, data) {
            return apiPromise.put('{0}/subsidiary-ledger-accounts/{1}'
                .format(urlPrefix, id), data);
        }
        ,
        remove: function (id) {
            return apiPromise.delete('{0}/subsidiary-ledger-accounts/{1}'
                .format(urlPrefix, id))
        }
        ,
        activate: function (id) {
            return apiPromise.put('{0}/subsidiary-ledger-accounts/{1}/activate'
                .format(urlPrefix, id));
        }
        ,
        deactivate: function (id) {
            return apiPromise.put('{0}/subsidiary-ledger-accounts/{1}/deactivate'
                .format(urlPrefix, id));
        }
    }
}

accModule
    .factory('subsidiaryLedgerAccountApi', subsidiaryLedgerAccountApi)


