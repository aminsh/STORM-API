import accModule from '../acc.module';

function detailAccountApi(apiPromise) {
    var urlPrefix = '/acc/api';

    return {
        url: {
            getAll: '{0}/detail-accounts'.format(urlPrefix),
            getAllActive: '{0}/detail-accounts/active'.format(urlPrefix)
        },
        getAll(){
            return apiPromise.get(`${urlPrefix}/detail-accounts`);
        },
        getById: function (id) {
            return apiPromise.get('{0}/detail-accounts/{1}'.format(urlPrefix, id));
        },
        create: function (data) {
            return apiPromise.post('{0}/detail-accounts'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/detail-accounts/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/detail-accounts/{1}'.format(urlPrefix, id));
        },
        activate: function (id) {
            return apiPromise.put('{0}/detail-accounts/{1}/activate'.format(urlPrefix, id));
        },
        deactivate: function (id) {
            return apiPromise.put('{0}/detail-accounts/{1}/deactivate'.format(urlPrefix, id));
        }
    };


}

accModule.factory('detailAccountApi', detailAccountApi);
