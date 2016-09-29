import accModule from '../acc.module';

function journalApi(apiPromise) {
    var urlPrefix = '/api';

    return {
        url: {
            getAll: '{0}/journals'.format(urlPrefix)
        },
        getById: function (id) {
            return apiPromise.get('{0}/journals/{1}'.format(urlPrefix, id));
        },
        create: function (data) {
            return apiPromise.post('{0}/journals'.format(urlPrefix), data);
        },
        update: function (id, data) {
            return apiPromise.put('{0}/journals/{1}'.format(urlPrefix, id), data);
        },
        remove: function (id) {
            return apiPromise.delete('{0}/journals/{1}'.format(urlPrefix, id));
        },
        copy: (id)=> apiPromise.post('{0}/journals/{1}/copy'.format(urlPrefix, id)),
        bookkeeping: (id, data)=> apiPromise.put('{0}/journals/{1}/bookkeeping'.format(urlPrefix, id), data),
        attachImage: (id, data)=> apiPromise.put('{0}/journals/{1}/attach-image'.format(urlPrefix, id), data)
    };
}

accModule.factory('journalApi', journalApi);
