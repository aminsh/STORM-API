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
        }
    };


}

accModule.factory('journalApi', journalApi);
